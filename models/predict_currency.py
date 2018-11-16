import asyncio
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from keras.models import Sequential
from keras.layers import Dense
from keras.layers import LSTM

class CurrencyModel:
    async def runModel(self, currency):
        df = pd.read_csv(
            f'models/currency_data/{currency}_history_parsed.csv')

        df['Date'] = pd.to_datetime(df['Date']).dt.date
        group = df.groupby('Date')
        real_price = group['Open'].mean()

        prediction_days = 90
        df_train = real_price[:len(real_price) - prediction_days]
        df_test = real_price[len(real_price) - prediction_days - 1:]

        training_set = df_train.values
        training_set = np.reshape(training_set, (len(training_set), 1))

        sc = MinMaxScaler()
        training_set = sc.fit_transform(training_set)
        X_train = training_set[0:len(training_set) - 1]
        y_train = training_set[1:len(training_set)]
        X_train = np.reshape(X_train, (len(X_train), 1, 1))

        # Initialising the RNN
        regressor = Sequential()

        # Adding the input layer and the LSTM layer
        regressor.add(LSTM(units=4, activation='sigmoid', input_shape=(None, 1)))

        # Adding the output layer
        regressor.add(Dense(units=1))

        # Compiling the RNN
        regressor.compile(optimizer='adam', loss='mean_squared_error')

        # Fitting the RNN to the Training set
        regressor.fit(X_train, y_train, batch_size=5, epochs=100)

        test_set = df_test.values
        inputs = np.reshape(test_set, (len(test_set), 1))
        inputs = sc.transform(inputs)
        inputs = np.reshape(inputs, (len(inputs), 1, 1))
        predicted_BTC_price = regressor.predict(inputs)
        predicted_BTC_price = sc.inverse_transform(predicted_BTC_price)

        print(predicted_BTC_price)
        tommorrowsPrice = predicted_BTC_price[-1]
        return float(tommorrowsPrice[0])
