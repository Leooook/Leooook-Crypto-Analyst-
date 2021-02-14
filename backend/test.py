import unittest
import json

from data import *

class Test(unittest.TestCase):   
    def setUp(self):
        print('setUp...')
        
    def test_process_data(self):
        data = getData()
        data = data.drop(columns=['_id'], axis = 1)
        
        with self.assertRaises(ValueError):
            processData(data)
        with self.assertRaises(ValueError):
            processData(data,'Price')

    def test_process_data(self):
        data = getData()
        data = data.drop(columns=['_id'], axis = 1)
        
        with self.assertRaises(ValueError):
             getLastDate(data)
        with self.assertRaises(ValueError):
             getLastDate(data,'Price')
        with self.assertRaises(ValueError):
             getLastDate(data,'Price','Open')

    def tearDown(self):
        print('tearDown...')

if __name__ == '__main__':
    unittest.main()