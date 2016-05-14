import json
from collections import defaultdict
import uuid
import time, datetime
from pprint import pprint
import tkinter

def date_time_milliseconds(date_time_obj):
   return int(time.mktime(date_time_obj.timetuple()) * 1000)

class Post:
   'Common base class for all post'
   def __init__(self):
      self.title = ""
      self.text = ""
      self.time = date_time_milliseconds(datetime.datetime.utcnow())
      self.types =""
posts = []

def save():
    with open(r'data/data.json' , encoding='UTF8') as data_file :
        posts = json.load(data_file)
        new_post = Post()
        print(new_post.time)
        new_post.title = top.title_entry.get()
        new_post.text = top.entry_text.get("1.0","end-1c").replace('\n', ' ')
        new_post.types = ""
        posts.append(new_post.__dict__)

    with open('data/data.json', 'w', encoding='UTF8') as outfile:
        json.dump(posts, outfile, ensure_ascii=False)
    top.destroy()
    print()
    print("-"*20)
    print("")
    print(" Successful writing to data file.")
    print(" will you commit?")
    print("")
    print("")
    print("-"*20)

def gui():
    top.iconbitmap(default='img/logo-2.ico')
    top.title_prompt = tkinter.Label(top, text="Title", anchor="w")
    top.title_entry = tkinter.Entry(top)
    top.entry_prompt = tkinter.Label(top, text="Entry", anchor="w")
    top.entry_text = tkinter.Text(top, height=30, width=40)
    top.submit = tkinter.Button(top, text="Submit", command = save)
    top.title_prompt.pack(side="top", fill="x")
    top.title_entry.pack(side="top", fill="x", padx=50)
    top.entry_prompt.pack(side="top", fill="x")
    top.entry_text.pack(side="top", fill="x", padx=50)
    top.submit.pack(side="bottom")

if __name__ == "__main__":
    top = tkinter.Tk()
    gui()
    top.mainloop()
