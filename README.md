# Real-Time Polling System

This project is a real-time polling system built using Node.js, Kafka, PostgreSQL, and WebSockets.

## Technologies Used:
- **Backend**: Node.js
- **Message Broker**: Kafka (with Zookeeper)
- **Database**: PostgreSQL
- **Real-Time Updates**: WebSockets
- **Containerization**: Docker

### Features:
1. Poll Creation: Users can create polls with multiple options.
2. Poll Voting: Users can vote on polls, and each vote is sent to Kafka for processing.
3. Real-Time Poll Updates: Results are updated live via WebSockets.
4. Leaderboard Feature: Real-time updates of popular poll options.
5. Concurrency & Fault Tolerance: Kafka and Zookeeper handle high concurrency and resiliency.

## Getting Started

### Requirements:
- Docker
- Node.js
- PostgreSQL

### Setup Instructions:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/polling-system.git
   cd polling-system
