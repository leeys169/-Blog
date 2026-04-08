const express = require('express');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = './posts.json';

// 미들웨어 설정
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 1. 데이터를 읽어오는 함수
const readData = () => {
    try {
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
};

// 2. 데이터를 저장하는 함수
const saveData = (data) => {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// 3. 글 목록 조회 (GET)
app.get('/api/posts', (req, res) => {
    const posts = readData();
    res.json(posts);
});

// 4. 글 추가하기 (POST)
app.post('/api/posts', (req, res) => {
    const posts = readData();
    
    // 바디에서 데이터 가져오기 (color와 date는 선택사항)
    const { title, category, mood, color, content, tags, date } = req.body;

    // 기분별 자동 색상 매핑 (직접 입력한 color가 없으면 여기서 선택)
    const moodColors = {
        "Happy": "#FFD700", // 행복
        "Excited": "#1E90FF", // 신남, 들뜸
        "Calm": "#98FB98",  // 차분, 안정
        "Frustrated": "#FF4500", // 짜증, 답답
        "Study": "#A29BFE",  // 공부, 학습
        "Normal": "#D3D3D3", // 보통, 평범
        "Sad": "#5F9EA0",  // 슬픔
        "Angry": "#DC143C", // 화남,분노
        "Tired": "#778899", // 피곤
        "Anxious": "#9370DB", // 불안
        "Focused": "#00B894", // 집중
        "Motivated": "#FF8C00", // 의욕, 동기부여
        "Relaxed": "#B2F7EF", // 편안, 여유
        "Confused": "#A0522D", // 혼란
        "Bored": "#C0C0C0", // 지루
        "Energetic": "#FF3B3B" // 활기, 에너지
    };

    const newPost = {
        id: Date.now(),
        title,
        category,
        mood,
        // ✅ 입력한 color가 있으면 그것을 쓰고, 없으면 무드 색상 사전에서 가져옴
        color: color || moodColors[mood] || "#D3D3D3",
        // ✅ 입력한 date가 있으면 그것을 쓰고, 없으면 오늘 날짜 생성
        date: date || new Date().toISOString().split('T')[0],
        content,
        tags: tags || []
    };

    posts.push(newPost);
    saveData(posts);

    res.status(201).json(newPost);
});

// 5. 루트 경로 테스트
app.get('/', (req, res) => {
    res.send('나의 블로그 API 서버가 시작되었습니다! 🚀');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});