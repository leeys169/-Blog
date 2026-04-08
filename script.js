async function fetchPosts() {
    try {
        // 1. 서버 API 호출
        const response = await fetch('posts.json');
        const posts = await response.json();

        // 2. 날짜 최신순 정렬 (최근에 공부한 내용이 맨 위로!)
        // b.date - a.date 순서여야 큰 숫자(최신)가 먼저 옵니다.
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        const container = document.getElementById('post-container');
        container.innerHTML = ''; // 화면 초기화

        // 3. 정렬된 데이터를 화면에 그리기
        posts.forEach(post => {
            const card = document.createElement('div');
            card.className = 'post-card';
            
            // CSS 변수를 사용해 기분 색상을 동적으로 적용
            card.style.setProperty('--mood-color', post.color);

            card.innerHTML = `
                <span class="mood-tag">${post.mood}</span>
                <div class="date">${post.date}</div>
                <h2>${post.title}</h2>
                <p>${post.content}</p>
                <div class="tags">${post.tags.map(t => `#${t}`).join(' ')}</div>
            `;
            container.appendChild(card);
        });
    } catch (error) {
        console.error("데이터를 가져오는데 실패했습니다:", error);
    }
}

// 페이지 로드 시 호출
fetchPosts();