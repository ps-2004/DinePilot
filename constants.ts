import { MenuItem, Staff } from './types';

export const MENU_ITEMS: MenuItem[] = [
  { id: '1', name: 'Butter Chicken', price: 320, category: 'Main', description: 'Rich tomato gravy with cream and fenugreek.' },
  { id: '2', name: 'Paneer Tikka', price: 240, category: 'Starter', description: 'Grilled cottage cheese marinated in spices.' },
  { id: '3', name: 'Masala Dosa', price: 180, category: 'Main', description: 'Crispy fermented crepe stuffed with potato masala.' },
  { id: '4', name: 'Chole Bhature', price: 150, category: 'Main', description: 'Spicy chickpea curry with fried bread.' },
  { id: '5', name: 'Veg Biryani', price: 210, category: 'Rice', description: 'Aromatic basmati rice cooked with vegetables and herbs.' },
  { id: '6', name: 'Chicken Biryani', price: 260, category: 'Rice', description: 'Layers of marinated chicken and saffron-infused rice.' },
  { id: '7', name: 'Dal Makhani', price: 170, category: 'Main', description: 'Slow-cooked black lentils with butter and cream.' },
  { id: '8', name: 'Tandoori Roti', price: 20, category: 'Bread', description: 'Whole wheat flatbread baked in a clay oven.' },
  { id: '9', name: 'Samosa (2 pcs)', price: 50, category: 'Starter', description: 'Fried pastry with spiced potato filling.' },
  { id: '10', name: 'Gulab Jamun', price: 80, category: 'Dessert', description: 'Milk solids soaked in rose sugar syrup.' },
  { id: '11', name: 'Mango Lassi', price: 90, category: 'Beverage', description: 'Yogurt based mango drink.' },
  { id: '12', name: 'Rogan Josh', price: 350, category: 'Main', description: 'Aromatic lamb curry from Kashmir.' },
];

export const STAFF_LIST: Staff[] = [
  { id: 's1', name: 'Rajesh Kumar' },
  { id: 's2', name: 'Priya Singh' },
  { id: 's3', name: 'Amit Patel' },
  { id: 's4', name: 'Sneha Gupta' },
];

// DevOps File Contents for display
export const DEVOPS_FILES = {
  dockerfile: `FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python", "app.py"]`,

  dockerCompose: `version: '3.8'

services:
  backend:
    build: .
    ports:
      - "5000:5000"
    environment:
      - AWS_ACCESS_KEY_ID=\${AWS_ACCESS_KEY}
      - AWS_SECRET_ACCESS_KEY=\${AWS_SECRET_KEY}
      - AWS_REGION=ap-south-1
      - DYNAMO_TABLE_ORDERS=OrdersTable
      - SNS_TOPIC_ARN=arn:aws:sns:ap-south-1:123456789012:OrderUpdates`,

  jenkinsfile: `pipeline {
    agent any
    
    environment {
        AWS_ACCOUNT_ID = credentials('aws-account-id')
        AWS_DEFAULT_REGION = 'ap-south-1'
        IMAGE_REPO_NAME = 'indian-restaurant-app'
        IMAGE_TAG = "\${env.BUILD_NUMBER}"
        REPOSITORY_URI = "\${AWS_ACCOUNT_ID}.dkr.ecr.\${AWS_DEFAULT_REGION}.amazonaws.com/\${IMAGE_REPO_NAME}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Install Dependencies') {
            steps {
                sh 'pip install -r requirements.txt'
            }
        }

        stage('Run Selenium Tests') {
            steps {
                sh 'python tests/selenium_test.py'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    docker.build("\${IMAGE_REPO_NAME}:\${IMAGE_TAG}")
                }
            }
        }

        stage('Push to ECR') {
            steps {
                script {
                    sh "aws ecr get-login-password --region \${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin \${AWS_ACCOUNT_ID}.dkr.ecr.\${AWS_DEFAULT_REGION}.amazonaws.com"
                    sh "docker tag \${IMAGE_REPO_NAME}:\${IMAGE_TAG} \${REPOSITORY_URI}:\${IMAGE_TAG}"
                    sh "docker push \${REPOSITORY_URI}:\${IMAGE_TAG}"
                }
            }
        }

        stage('Deploy') {
            steps {
                sh "echo 'Deploying to ECS Cluster...'"
                // Actual ECS update command would go here
            }
        }
    }
}`,

  backendPy: `from flask import Flask, request, jsonify
import boto3
import uuid
from datetime import datetime

app = Flask(__name__)
dynamodb = boto3.resource('dynamodb')
sns = boto3.client('sns')
table = dynamodb.Table('OrdersTable')

@app.route('/order', methods=['POST'])
def place_order():
    data = request.json
    order_id = str(uuid.uuid4())
    item = {
        'id': order_id,
        'items': data['items'],
        'total': data['total'],
        'status': 'Placed',
        'customer': data['customerName'],
        'timestamp': datetime.now().isoformat()
    }
    table.put_item(Item=item)
    return jsonify({'orderId': order_id, 'status': 'Placed'})

@app.route('/chef/orders', methods=['GET'])
def get_pending_orders():
    # In reality, use GSI for status filtering
    resp = table.scan() 
    pending = [i for i in resp['Items'] if i['status'] in ['Placed', 'Cooking']]
    return jsonify(pending)

@app.route('/chef/update', methods=['PUT'])
def update_status():
    data = request.json
    table.update_item(
        Key={'id': data['id']},
        UpdateExpression="set #s = :s",
        ExpressionAttributeNames={'#s': 'status'},
        ExpressionAttributeValues={':s': data['status']}
    )
    
    if data['status'] == 'Ready':
        sns.publish(
            TopicArn='arn:aws:sns:us-east-1:123:Orders',
            Message=f"Order {data['id']} is Ready!",
            Subject="Order Update"
        )
        
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)`,
  
  seleniumTest: `from selenium import webdriver
from selenium.webdriver.common.by import By
import time

driver = webdriver.Chrome()

def test_flow():
    driver.get("http://localhost:3000")
    
    # 1. Customer: Place Order
    driver.find_element(By.ID, "tab-customer").click()
    driver.find_element(By.ID, "add-2").click() # Add Paneer Tikka
    driver.find_element(By.ID, "place-order-btn").click()
    time.sleep(2)
    
    # 2. Chef: Start Cooking
    driver.find_element(By.ID, "tab-chef").click()
    driver.find_element(By.CLASS_NAME, "btn-cook").click()
    time.sleep(1)
    
    # 3. Chef: Mark Ready
    driver.find_element(By.CLASS_NAME, "btn-ready").click()
    time.sleep(1)
    
    # 4. Manager: Serve
    driver.find_element(By.ID, "tab-manager").click()
    driver.find_element(By.CLASS_NAME, "btn-serve").click()
    
    print("Test Passed!")
    driver.quit()

if __name__ == "__main__":
    test_flow()`
};