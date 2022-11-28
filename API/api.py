# Imports

# Flask
from flask import Flask
from markupsafe import escape

# Others
import pyautogui as pag


app = Flask(__name__)
app.config.from_pyfile('api_configs.py')


# URLs
@app.route('/down/key/<string:dkey>')
def down_key(dkey):
    # Down key.
    pag.press(dkey)

    # Feedback
    return f'He oprimido la tecla {escape(dkey).upper()}'




app.run(host = '192.168.0.3')