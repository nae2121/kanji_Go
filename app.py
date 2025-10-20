from flask import Flask, render_template, jsonify
import json

app = Flask(__name__)

# 固定問題を読み込む
with open('questions.json', encoding='utf-8') as f:
    questions = json.load(f)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/quiz')
def quiz():
    return render_template('quiz.html')

@app.route('/api/questions')
def api_questions():
    return jsonify(questions)

if __name__ == '__main__':
    app.run(debug=True)
