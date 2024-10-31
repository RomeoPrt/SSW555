import unittest # Import unittest for testing 
import os # Import os for file manipulation
from llama import load_history, save_history, query_llama # Import functions to be tested


class TestVoiceAssistant(unittest.TestCase):

    # This function does the set up for each test by creating a sample history file
    def setUp(self):
        self.HISTORY_FILE = "history.txt" # name history file: HISTORY_FILE
        with open(self.HISTORY_FILE,'w') as file: # open file in write mode 
            file.write(f"User: I have diabetes and high blood pressure\nAssistant: If you have diabetes and high blood pressure, closely monitoring both your blood sugar and blood pressure level\n")
    
    # This function will check if the HISTORY_FILE exists and if it does, it deletes it to prepare for next test
    def tearDown(self):
        if os.path.exists(self.HISTORY_FILE): # check if history file exists 
            os.remove(self.HISTORY_FILE) # remove file for next test

    # This function tests load_history() has expected content 
    def test_load_history_with_created_file(self):
        history = load_history() # call load_history() to read contents 
        with open(self.HISTORY_FILE,'r') as file: # open file in read mode
            self.assertEqual(history,"User: I have diabetes and high blood pressure\nAssistant: If you have diabetes and high blood pressure, closely monitoring both your blood sugar and blood pressure level") 

    # This function tests load_history() when history file does not exist
    def test_load_history_with_no_file(self):
        if os.path.exists(self.HISTORY_FILE): # check if history file exists
            os.remove(self.HISTORY_FILE) # if it does, remove it 

        history = load_history() # call load_history() to read contents 
        self.assertEqual(history,"") # asserts expected content in history whic is just an empty string 
    
    # This function tests save_history() to check that it writes what the user and voice assistant says into history file
    def test_save_history(self):
        if os.path.exists(self.HISTORY_FILE): # check if history file exists
            with open(self.HISTORY_FILE, 'w') as file: # if it does, open file in write mode
                pass # clear contents of history file 

        save_history("Hello, Voice Assistant", "Hi, user") # save a new entry to history file

        with open(self.HISTORY_FILE,'r') as file: # open history file in read mode 
            actual = file.read() # read contents and save into variable 
        
        expected = ("User: Hello, Voice Assistant\nVoice Assistant: Hi, user\n") # expected output

        self.assertEqual(actual,expected) # assert actual contents and expected output match

    # This function tests query_llama() with a empty string to check expected response
    def test_query_llama_with_empty_string_prompt(self):
        response = query_llama("") # call query_llama with empty prompt 
        self.assertEqual(response,"I didn't catch that. Please say it again.") # assert expected output

    # This function tests query_llama() with a None as input to check expected response
    def test_query_llama_with_no_prompt(self):
        response = query_llama(None) # call query_llama with None as prompt 
        self.assertEqual(response,"I didn't catch that. Please say it again.") # assert expected output
    
    
# Running Tests
if __name__ == '__main__':
    unittest.main()