# AI & Analytics Module Workflows

This document visualizes and maps the operational pipelines of key features in the AI module.

## 1. Attendance Prediction Pipeline

```mermaid
graph TD
    A[Biometric Registry & Attendance Logs] -->|Daily Sync| B[LSTM Forecasting Engine]
    B -->|Predicts Semester End-Sem %| C{Predicted Attendance < 75%?}
    C -->|Yes: Flag Critical/High Risk| D[Attendance Prediction Page]
    C -->|No: Low Risk| E[Mark Healthy Profile]
    D -->|Faculty Override / Trigger Alert| F[Notification Engine]
    F -->|SMTP Email / Twilio SMS| G[Parent / Student Alerted]
```

---

## 2. Student Risk Assessment Pipeline

```mermaid
graph TD
    A1[Attendance Rates] --> B1[XGBoost Classifier Engine]
    A2[Exam Marks & CGPA] --> B1
    A3[LMS Assignment Submissions] --> B1
    A4[Fee Payment Delinquencies] --> B1
    
    B1 -->|Calculates Risk Score 1-100| C1[Risk Index Table]
    C1 -->|Faculty Advisory Action| D1{Custom Override Notes?}
    D1 -->|Yes| E1[Submit recommendation notes]
    E1 -->|PUT /risk/recommendation| F1[Update database with override recommendations]
    D1 -->|No| G1[Maintain auto-generated ML recommendation]
```

---

## 3. Conversational AI Chatbot Pipeline

```mermaid
graph TD
    U[User Types Natural Query] -->|POST /chatbot/message| C2[AI Chatbot Router]
    C2 -->|Intent: Attendance| I1[Retrieve predicted end-sem log]
    C2 -->|Intent: Timetable| I2[Fetch class calendar list]
    C2 -->|Intent: Fees Dues| I3[Pull pending balances log]
    C2 -->|Intent: Placement| I4[Run placement eligibility classifier]
    
    I1 --> R[Format response as UI Card / Table / Chart]
    I2 --> R
    I3 --> R
    I4 --> R
    
    R -->|Display in chat feed| U
```
