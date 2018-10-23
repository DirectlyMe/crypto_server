import sys
import asyncio
import datetime
from pymongo import MongoClient
from predict_currency import CurrencyModel

async def main():
  currencies = ['BTC', 'ETH', 'LTC', 'XRP']
  model = CurrencyModel()
  
  BitcoinPrice = await model.runModel(currencies[0])
  EtheriumPrice = await model.runModel(currencies[1])
  LitecoinPrice = await model.runModel(currencies[2])
  RipplePrice = await model.runModel(currencies[3])

  date = str(datetime.datetime.now())

  tomorrowPrices = {
    "Date": date[0:10],
    "BTC": BitcoinPrice,
    "ETH": EtheriumPrice,
    "LTC": LitecoinPrice,
    "XRP": RipplePrice
  }

  client = MongoClient()
  db = client.CryptoWatch
  coll = db.predictedPrices

  coll.insert_one(tomorrowPrices).inserted_id


if __name__ == "__main__":
  loop = asyncio.get_event_loop()
  loop.run_until_complete(main())