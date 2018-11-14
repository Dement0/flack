import os

from flask import Flask, jsonify, render_template, request
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")
socketio = SocketIO(app)

# List for channel storage
channels = []

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/create_channel", methods=["POST"])
def create_channel():

    # Query for channel name
    ch = request.form.get("channel")

    # Loop channels to see if channel name exists
    channel_exists = False
    for c in channels:
        if c['channel_name'] == ch:
            channel_exists = True
            return jsonify({"success": False})

    # If channel does not exist, append it to channels list
    if not channel_exists:
        channel = {"channel_name": ch, "channel_creator": "unknown", "channel_members": []}
        channels.append(channel)

    return jsonify({
        "success": True,
        "channel_name": channel['channel_name'],
        "channel_creator": channel['channel_creator']})


@app.route("/get_channels", methods=["POST"])
def get_channels():

    # If no channel in channels, return False
    if len(channels) is 0:
        return jsonify({"success": False})

    # Else, return channels
    return jsonify({"success": True, "channels": channels})


@app.route("/join_channel", methods=["POST"])
def join_channel():

    # Get the corresponding info from the form submitted
    username = request.form.get("username")
    channelToBeJoined = request.form.get("channelToBeJoined")

    for c in channels:
        # If channel exists
        if c['channel_name'] == channelToBeJoined:
            # Append info to that channel
            c['channel_members'].append({"member": username, "join_time": "now"})
            channelJoined = c
            print(c)
            return jsonify({"success": True, "channel_joined": c})

    return jsonify({"success": False})
