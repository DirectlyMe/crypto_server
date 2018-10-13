import sys
import asyncio
import datetime
from pymongo import MongoClient
from predict_currency import CurrencyModel

async def main():
  currencies = ['BTC', 'ETH', 'LTC']
  model = CurrencyModel()
  
  BitcoinPrice = await model.runModel(currencies[0])
  EtheriumPrice = await model.runModel(currencies[1])
  LitecoinPrice = await model.runModel(currencies[2])

  tomorrowPrices = {
    "Date": datetime.datetime.now("mm/dd/yyyy"),
    "BTC": BitcoinPrice,
    "ETH": EtheriumPrice,
    "LTC": LitecoinPrice
  }

  client = MongoClient()
  db = client.CryptoWatch
  coll = db.predictedPrices

  coll.insert_one(tomorrowPrices).insert_id

  sys.exit(0)


if __name__ == "__main__":
  main()