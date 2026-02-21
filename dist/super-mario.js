"use strict";
/**
 * 超级玛丽 - 横版平台跳跃游戏
 */
document.addEventListener("DOMContentLoaded", () => init());
function init() {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    const W = 800;
    const H = 400;
    const GRAVITY = 0.6;
    const JUMP_FORCE = -12;
    const RUN_SPEED = 5;
    const TILE = 32;
    const LEVELS = [
        {
            platforms: [
                { x: 0, y: H - TILE, w: 3000, h: TILE },
                { x: 400, y: H - TILE - 80, w: 120, h: 20 },
                { x: 600, y: H - TILE - 140, w: 100, h: 20 },
                { x: 800, y: H - TILE - 80, w: 150, h: 20 },
                { x: 1100, y: H - TILE - 160, w: 120, h: 20 },
                { x: 1400, y: H - TILE - 100, w: 200, h: 20 },
                { x: 1800, y: H - TILE - 60, w: 300, h: 20 },
                { x: 2400, y: H - TILE - 120, w: 150, h: 20 },
            ],
            pipes: [
                { x: 350, y: H - TILE - 64, w: 48, h: 64 },
                { x: 950, y: H - TILE - 96, w: 48, h: 96 },
                { x: 2200, y: H - TILE - 96, w: 48, h: 96 },
            ],
            questionBlocks: [
                { rect: { x: 250, y: H - TILE - 120, w: TILE, h: TILE }, type: "coin" },
                { rect: { x: 500, y: H - TILE - 160, w: TILE, h: TILE }, type: "coin" },
                { rect: { x: 750, y: H - TILE - 200, w: TILE, h: TILE }, type: "coin" },
                { rect: { x: 1300, y: H - TILE - 200, w: TILE, h: TILE }, type: "coin" },
            ],
            enemies: [
                { x: 450, y: H - TILE - 32, vx: -1.5, type: "goomba" },
                { x: 700, y: H - TILE - 32, vx: -1.5, type: "goomba" },
                { x: 1250, y: H - TILE - 32, vx: -1.5, type: "goomba" },
                { x: 1600, y: H - TILE - 32, vx: -1.5, type: "goomba" },
                { x: 2100, y: H - TILE - 32, vx: -1.5, type: "goomba" },
            ],
            flagX: 2650,
            groundWidth: 3000,
        },
        {
            platforms: [
                { x: 0, y: H - TILE, w: 3500, h: TILE },
                { x: 300, y: H - TILE - 60, w: 100, h: 20 },
                { x: 550, y: H - TILE - 100, w: 80, h: 20 },
                { x: 750, y: H - TILE - 60, w: 120, h: 20 },
                { x: 1050, y: H - TILE - 120, w: 100, h: 20 },
                { x: 1300, y: H - TILE - 80, w: 100, h: 20 },
                { x: 1600, y: H - TILE - 140, w: 100, h: 20 },
                { x: 1900, y: H - TILE - 100, w: 120, h: 20 },
                { x: 2200, y: H - TILE - 60, w: 100, h: 20 },
                { x: 2500, y: H - TILE - 120, w: 100, h: 20 },
                { x: 2800, y: H - TILE - 80, w: 150, h: 20 },
                { x: 3100, y: H - TILE - 100, w: 120, h: 20 },
            ],
            pipes: [
                { x: 200, y: H - TILE - 80, w: 48, h: 80 },
                { x: 450, y: H - TILE - 96, w: 48, h: 96 },
                { x: 650, y: H - TILE - 64, w: 48, h: 64 },
                { x: 900, y: H - TILE - 96, w: 48, h: 96 },
                { x: 1150, y: H - TILE - 80, w: 48, h: 80 },
                { x: 1450, y: H - TILE - 112, w: 48, h: 112 },
                { x: 1750, y: H - TILE - 96, w: 48, h: 96 },
                { x: 2050, y: H - TILE - 80, w: 48, h: 80 },
                { x: 2350, y: H - TILE - 96, w: 48, h: 96 },
                { x: 2650, y: H - TILE - 64, w: 48, h: 64 },
                { x: 2950, y: H - TILE - 80, w: 48, h: 80 },
            ],
            questionBlocks: [
                { rect: { x: 400, y: H - TILE - 180, w: TILE, h: TILE }, type: "coin" },
                { rect: { x: 1200, y: H - TILE - 200, w: TILE, h: TILE }, type: "coin" },
                { rect: { x: 2000, y: H - TILE - 180, w: TILE, h: TILE }, type: "coin" },
            ],
            enemies: [
                { x: 350, y: H - TILE - 32, vx: -1.5, type: "goomba" },
                { x: 800, y: H - TILE - 32, vx: -1.5, type: "goomba" },
                { x: 1400, y: H - TILE - 32, vx: -1.5, type: "goomba" },
                { x: 2100, y: H - TILE - 32, vx: -1.5, type: "goomba" },
                { x: 2700, y: H - TILE - 32, vx: -1.5, type: "goomba" },
            ],
            flagX: 3300,
            groundWidth: 3500,
        },
        {
            platforms: [
                { x: 0, y: H - TILE, w: 3800, h: TILE },
                { x: 250, y: H - TILE - 70, w: 100, h: 20 },
                { x: 500, y: H - TILE - 120, w: 90, h: 20 },
                { x: 750, y: H - TILE - 70, w: 110, h: 20 },
                { x: 1000, y: H - TILE - 150, w: 100, h: 20 },
                { x: 1300, y: H - TILE - 90, w: 100, h: 20 },
                { x: 1600, y: H - TILE - 130, w: 110, h: 20 },
                { x: 1950, y: H - TILE - 80, w: 120, h: 20 },
                { x: 2250, y: H - TILE - 140, w: 100, h: 20 },
                { x: 2550, y: H - TILE - 90, w: 110, h: 20 },
                { x: 2850, y: H - TILE - 120, w: 100, h: 20 },
                { x: 3150, y: H - TILE - 70, w: 150, h: 20 },
                { x: 3450, y: H - TILE - 100, w: 120, h: 20 },
            ],
            pipes: [
                { x: 180, y: H - TILE - 72, w: 48, h: 72 },
                { x: 420, y: H - TILE - 88, w: 48, h: 88 },
                { x: 680, y: H - TILE - 64, w: 48, h: 64 },
                { x: 950, y: H - TILE - 96, w: 48, h: 96 },
                { x: 1220, y: H - TILE - 80, w: 48, h: 80 },
                { x: 1520, y: H - TILE - 96, w: 48, h: 96 },
                { x: 1850, y: H - TILE - 72, w: 48, h: 72 },
                { x: 2180, y: H - TILE - 96, w: 48, h: 96 },
                { x: 2480, y: H - TILE - 80, w: 48, h: 80 },
                { x: 2780, y: H - TILE - 88, w: 48, h: 88 },
                { x: 3080, y: H - TILE - 64, w: 48, h: 64 },
                { x: 3350, y: H - TILE - 80, w: 48, h: 80 },
            ],
            questionBlocks: [
                { rect: { x: 350, y: H - TILE - 190, w: TILE, h: TILE }, type: "coin" },
                { rect: { x: 1100, y: H - TILE - 230, w: TILE, h: TILE }, type: "coin" },
                { rect: { x: 2050, y: H - TILE - 220, w: TILE, h: TILE }, type: "coin" },
                { rect: { x: 2950, y: H - TILE - 200, w: TILE, h: TILE }, type: "coin" },
            ],
            enemies: [
                { x: 320, y: H - TILE - 32, vx: -1.2, type: "turtle" },
                { x: 600, y: H - TILE - 32, vx: -1.2, type: "turtle" },
                { x: 1100, y: H - TILE - 32, vx: 1.2, type: "goomba" },
                { x: 1450, y: H - TILE - 32, vx: -1.2, type: "turtle" },
                { x: 1750, y: H - TILE - 32, vx: 1.2, type: "turtle" },
                { x: 2150, y: H - TILE - 32, vx: -1.2, type: "goomba" },
                { x: 2500, y: H - TILE - 32, vx: -1.2, type: "turtle" },
                { x: 2850, y: H - TILE - 32, vx: 1.2, type: "turtle" },
                { x: 3200, y: H - TILE - 32, vx: -1.2, type: "goomba" },
            ],
            flagX: 3600,
            groundWidth: 3800,
        },
    ];
    // 当前关卡数据 (可变)
    let platforms = [];
    let pipes = [];
    let questionBlocks = [];
    let enemies = [];
    let mushrooms = [];
    let flagX = 0;
    let groundWidth = 3000;
    let currentLevel = 0;
    // 马里奥
    const mario = {
        x: 80,
        y: H - TILE - 32,
        vx: 0,
        vy: 0,
        w: 28,
        h: 32,
        grounded: false,
        faceRight: true,
    };
    // 游戏状态
    let score = 0;
    let coins = 0;
    let lives = 3;
    let cameraX = 0;
    let gameState = "start";
    let deathTimer = 0;
    let winTimer = 0;
    const scoreEl = document.getElementById("score");
    const coinsEl = document.getElementById("coins");
    const livesEl = document.getElementById("lives");
    const levelEl = document.getElementById("level");
    const startOverlay = document.getElementById("startOverlay");
    const gameOverOverlay = document.getElementById("gameOverOverlay");
    const winOverlay = document.getElementById("winOverlay");
    const startBtn = document.getElementById("startBtn");
    const restartBtn = document.getElementById("restartBtn");
    const finalScoreEl = document.getElementById("finalScore");
    const winScoreEl = document.getElementById("winScore");
    const registerOverlay = document.getElementById("registerOverlay");
    const usernameInput = document.getElementById("usernameInput");
    const registerBtn = document.getElementById("registerBtn");
    const startWelcomeEl = document.getElementById("startWelcome");
    const boardOverlay = document.getElementById("boardOverlay");
    const closeBoardBtn = document.getElementById("closeBoardBtn");
    const switchUserBtn = document.getElementById("switchUserBtn");
    const showBoardBtn = document.getElementById("showBoardBtn");
    const hudBoardBtn = document.getElementById("hudBoardBtn");
    const myHistoryTitleEl = document.getElementById("myHistoryTitle");
    // ========== Supabase 客户端 ==========
    const SUPABASE_URL = "https://keabgkpeuyasxvqeidnr.supabase.co";
    const SUPABASE_KEY = "sb_publishable_ajGQB1CGxWUVO7h33IMLhw_-H6YO9aa";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const db = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);
    let username = ""; // 每次必须登陆，不自动读取
    let scoreSaved = false;
    function getRecentUsers() {
        try {
            return JSON.parse(localStorage.getItem("mario_recent_users") || "[]");
        }
        catch {
            return [];
        }
    }
    function addRecentUser(name) {
        const list = getRecentUsers().filter(u => u !== name);
        list.unshift(name);
        localStorage.setItem("mario_recent_users", JSON.stringify(list.slice(0, 5)));
    }
    function renderRecentUsers() {
        const container = document.getElementById("recentUsers");
        const label = document.getElementById("recentLabel");
        if (!container)
            return;
        const users = getRecentUsers();
        if (users.length === 0) {
            container.innerHTML = "";
            if (label)
                label.style.display = "none";
            return;
        }
        if (label)
            label.style.display = "block";
        container.innerHTML = users.map(u => `<button class="recent-btn" data-name="${u}">${u}</button>`).join("");
        container.querySelectorAll(".recent-btn").forEach(btn => {
            btn.addEventListener("click", () => {
                usernameInput.value = btn.dataset.name || "";
            });
        });
    }
    async function saveScore() {
        if (!username || scoreSaved)
            return;
        scoreSaved = true;
        await db.from("scores").insert({ name: username, score });
    }
    async function getTopScores(limit = 8) {
        const { data } = await db.from("scores").select("name, score").order("score", { ascending: false }).limit(limit);
        return data || [];
    }
    async function getMyHistory(limit = 5) {
        const { data } = await db.from("scores").select("score, created_at").eq("name", username).order("created_at", { ascending: false }).limit(limit);
        return data || [];
    }
    async function renderLeaderboard(containerId) {
        const el = document.getElementById(containerId);
        if (!el)
            return;
        el.innerHTML = '<div class="lb-empty">加载中...</div>';
        const board = await getTopScores(containerId === "loginBoard" ? 5 : 8);
        if (board.length === 0) {
            el.innerHTML = '<div class="lb-empty">暂无记录</div>';
            return;
        }
        el.innerHTML = board.map((e, i) => `<div class="lb-row rank-${i + 1}"><span>#${i + 1} ${e.name}</span><span>${e.score}</span></div>`).join("");
    }
    async function renderMyHistory(containerId) {
        const el = document.getElementById(containerId);
        if (!el)
            return;
        el.innerHTML = '<div class="lb-empty">加载中...</div>';
        const history = await getMyHistory(5);
        if (history.length === 0) {
            el.innerHTML = '<div class="lb-empty">暂无记录</div>';
            return;
        }
        el.innerHTML = history.map((e, i) => {
            const date = e.created_at
                ? new Date(e.created_at).toLocaleDateString("zh-CN", { month: "numeric", day: "numeric" })
                : "";
            return `<div class="lb-row"><span>#${i + 1} ${date}</span><span>${e.score}</span></div>`;
        }).join("");
    }
    function openBoardOverlay(fromStart) {
        if (fromStart)
            startOverlay.classList.add("hidden");
        myHistoryTitleEl.textContent = `${username} 的历史`;
        boardOverlay.dataset.returnTo = fromStart ? "start" : "";
        boardOverlay.classList.remove("hidden");
        renderLeaderboard("fullBoard");
        renderMyHistory("myHistoryBoard");
    }
    // 初始化：加载登陆界面预览 + 最近账号
    renderLeaderboard("loginBoard");
    renderRecentUsers();
    registerBtn.addEventListener("click", () => {
        const name = usernameInput.value.trim().slice(0, 10);
        if (!name)
            return;
        username = name;
        addRecentUser(name);
        registerOverlay.classList.add("hidden");
        startWelcomeEl.textContent = `欢迎, ${username}!`;
        startOverlay.classList.remove("hidden");
    });
    usernameInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter")
            registerBtn.click();
    });
    switchUserBtn.addEventListener("click", () => {
        username = "";
        scoreSaved = false;
        startOverlay.classList.add("hidden");
        registerOverlay.classList.remove("hidden");
        renderRecentUsers();
    });
    showBoardBtn.addEventListener("click", () => openBoardOverlay(true));
    hudBoardBtn.addEventListener("click", () => {
        if (gameState === "playing")
            return;
        openBoardOverlay(startOverlay.classList.contains("hidden") === false);
    });
    closeBoardBtn.addEventListener("click", () => {
        boardOverlay.classList.add("hidden");
        if (boardOverlay.dataset.returnTo === "start")
            startOverlay.classList.remove("hidden");
    });
    function aabb(a, b) {
        return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
    }
    function resolvePlatform(m, p) {
        const mx = m.x + m.w / 2;
        const my = m.y + m.h;
        if (m.vy > 0 && my - m.vy <= p.y && my >= p.y && mx > p.x && mx < p.x + p.w) {
            m.y = p.y - m.h;
            m.vy = 0;
            m.grounded = true;
            return true;
        }
        return false;
    }
    function loadLevel(levelIndex) {
        const data = LEVELS[levelIndex];
        if (!data)
            return;
        currentLevel = levelIndex;
        platforms = data.platforms.map((p) => ({ ...p }));
        pipes = data.pipes.map((p) => ({ ...p }));
        questionBlocks = data.questionBlocks.map((q) => ({ rect: { ...q.rect }, hit: false, type: q.type }));
        enemies = data.enemies.map((e) => ({ ...e, w: 28, h: 28, dead: false }));
        mushrooms = [];
        flagX = data.flagX;
        groundWidth = data.groundWidth;
    }
    function resetGame(fullReset = true) {
        if (fullReset) {
            score = 0;
            coins = 0;
            lives = 3;
            currentLevel = 0;
            scoreSaved = false;
        }
        loadLevel(currentLevel);
        mario.x = 80;
        mario.y = H - TILE - 32;
        mario.vx = 0;
        mario.vy = 0;
        mario.grounded = false;
        mario.faceRight = true;
        cameraX = 0;
        gameState = "playing";
        deathTimer = 0;
        winTimer = 0;
    }
    function update() {
        if (gameState !== "playing") {
            if (gameState === "dead") {
                deathTimer++;
                if (deathTimer > 120) {
                    lives--;
                    livesEl.textContent = String(lives);
                    if (lives <= 0) {
                        gameState = "start";
                        gameOverOverlay.classList.remove("hidden");
                        finalScoreEl.textContent = String(score);
                        saveScore().then(() => {
                            renderLeaderboard("gameoverBoard");
                            renderMyHistory("gameoverMyBoard");
                        });
                    }
                    else {
                        resetGame(false);
                    }
                }
            }
            if (gameState === "win") {
                winTimer++;
                if (winTimer === 121) {
                    winOverlay.classList.remove("hidden");
                    winScoreEl.textContent = String(score);
                    saveScore().then(() => {
                        renderLeaderboard("winBoard");
                        renderMyHistory("winMyBoard");
                    });
                }
            }
            return;
        }
        // 输入
        mario.vx = 0;
        if (keys["ArrowRight"] || keys["KeyD"]) {
            mario.vx = RUN_SPEED;
            mario.faceRight = true;
        }
        if (keys["ArrowLeft"] || keys["KeyA"]) {
            mario.vx = -RUN_SPEED;
            mario.faceRight = false;
        }
        if ((keys["ArrowUp"] || keys["KeyW"] || keys["Space"]) && mario.grounded) {
            mario.vy = JUMP_FORCE;
            mario.grounded = false;
        }
        // 重力
        mario.vy += GRAVITY;
        mario.grounded = false;
        // 移动
        mario.x += mario.vx;
        mario.y += mario.vy;
        // 平台碰撞
        for (const p of platforms) {
            resolvePlatform(mario, p);
        }
        // 水管碰撞
        for (const p of pipes) {
            const mr = { x: mario.x, y: mario.y, w: mario.w, h: mario.h };
            if (aabb(mr, p)) {
                if (mario.vx > 0 && mario.x + mario.w - mario.vx <= p.x)
                    mario.x = p.x - mario.w;
                else if (mario.vx < 0 && mario.x - mario.vx >= p.x + p.w)
                    mario.x = p.x + p.w;
                else if (mario.vy > 0) {
                    mario.y = p.y - mario.h;
                    mario.vy = 0;
                    mario.grounded = true;
                }
            }
        }
        // 问号砖块 (支持从下方顶和从上方落下)
        for (const q of questionBlocks) {
            if (q.hit)
                continue;
            const mr = { x: mario.x, y: mario.y, w: mario.w, h: mario.h };
            if (!aabb(mr, q.rect))
                continue;
            const hitFromBelow = mario.vy < 0 && mario.y - mario.vy >= q.rect.y + q.rect.h;
            const hitFromAbove = mario.vy > 0 && mario.y + mario.h - mario.vy <= q.rect.y;
            if (hitFromBelow) {
                q.hit = true;
                mario.y = q.rect.y + q.rect.h;
                mario.vy = 0;
                score += 100;
                if (q.type === "coin") {
                    coins++;
                    score += 200;
                }
                // 生成蘑菇道具
                mushrooms.push({
                    x: q.rect.x + q.rect.w / 2 - 14,
                    y: q.rect.y - 28,
                    vx: 1.5,
                    vy: 0,
                    w: 28,
                    h: 28,
                    collected: false,
                });
            }
            else if (hitFromAbove) {
                q.hit = true;
                mario.y = q.rect.y - mario.h;
                mario.vy = 0;
                mario.grounded = true;
                score += 100;
                if (q.type === "coin") {
                    coins++;
                    score += 200;
                }
            }
        }
        // 敌人 (蘑菇怪 + 乌龟)
        for (const e of enemies) {
            if (e.dead)
                continue;
            e.x += e.vx;
            const eRect = { x: e.x, y: e.y, w: e.w, h: e.h };
            for (const p of platforms) {
                if (aabb(eRect, p) && e.y + e.h - 2 <= p.y) {
                    e.y = p.y - e.h;
                    if (e.x <= p.x || e.x + e.w >= p.x + p.w)
                        e.vx *= -1;
                    break;
                }
            }
            for (const p of pipes) {
                if (aabb(eRect, p))
                    e.vx *= -1;
            }
            const mr = { x: mario.x, y: mario.y, w: mario.w, h: mario.h };
            if (aabb(mr, eRect)) {
                if (mario.vy > 0 && mario.y + mario.h - mario.vy <= e.y + 8) {
                    e.dead = true;
                    mario.vy = -8;
                    mario.grounded = false;
                    score += e.type === "turtle" ? 200 : 100;
                }
                else {
                    gameState = "dead";
                    deathTimer = 0;
                }
            }
        }
        // 蘑菇道具更新
        for (const m of mushrooms) {
            if (m.collected)
                continue;
            m.vy += GRAVITY;
            m.x += m.vx;
            m.y += m.vy;
            // 平台落地
            for (const p of platforms) {
                const cy = m.y + m.h;
                const cx = m.x + m.w / 2;
                if (m.vy > 0 && cy - m.vy <= p.y && cy >= p.y && cx > p.x && cx < p.x + p.w) {
                    m.y = p.y - m.h;
                    m.vy = 0;
                }
            }
            // 碰到水管反向
            for (const p of pipes) {
                const mr = { x: m.x, y: m.y, w: m.w, h: m.h };
                if (aabb(mr, p))
                    m.vx *= -1;
            }
            // 掉落消失
            if (m.y > H) {
                m.collected = true;
                continue;
            }
            // 马里奥碰到蘑菇：加命+积分
            const mRect = { x: m.x, y: m.y, w: m.w, h: m.h };
            const playerRect = { x: mario.x, y: mario.y, w: mario.w, h: mario.h };
            if (aabb(playerRect, mRect)) {
                m.collected = true;
                score += 1000;
                lives++;
                livesEl.textContent = String(lives);
            }
        }
        // 掉落死亡
        if (mario.y > H) {
            gameState = "dead";
            deathTimer = 0;
        }
        // 到达终点
        if (mario.x >= flagX - 20) {
            score += 5000;
            if (currentLevel < LEVELS.length - 1) {
                currentLevel++;
                loadLevel(currentLevel);
                mario.x = 80;
                mario.y = H - TILE - 32;
                mario.vx = 0;
                mario.vy = 0;
                mario.grounded = false;
                cameraX = 0;
            }
            else {
                gameState = "win";
                winTimer = 0;
            }
        }
        // 相机（双向跟随）
        const targetCam = mario.x - W / 3;
        cameraX = Math.max(0, Math.min(targetCam, flagX - W + 100));
        scoreEl.textContent = String(score);
        coinsEl.textContent = String(coins);
        livesEl.textContent = String(lives);
        if (levelEl)
            levelEl.textContent = String(currentLevel + 1);
    }
    const keys = {};
    document.addEventListener("keydown", (e) => {
        keys[e.code] = true;
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Space"].includes(e.key))
            e.preventDefault();
    });
    document.addEventListener("keyup", (e) => (keys[e.code] = false));
    function draw() {
        ctx.fillStyle = "#5c94fc";
        ctx.fillRect(0, 0, W, H);
        // 云 (固定屏幕位置，彩色)
        const cloudColors = ["rgba(255,180,180,0.85)", "rgba(180,220,255,0.85)", "rgba(200,255,180,0.85)"];
        [[100, 50], [350, 70], [600, 40]].forEach(([px, py], i) => {
            ctx.fillStyle = cloudColors[i];
            ctx.beginPath();
            ctx.arc(px, py, 25, 0, Math.PI * 2);
            ctx.arc(px + 30, py, 30, 0, Math.PI * 2);
            ctx.arc(px + 60, py, 25, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.save();
        ctx.translate(-cameraX, 0);
        // 地面/砖块
        const tileCount = Math.ceil(groundWidth / TILE);
        for (let i = 0; i < tileCount; i++) {
            const x = i * TILE;
            if (x + TILE < cameraX || x > cameraX + W + TILE)
                continue;
            ctx.fillStyle = "#c65c3c";
            ctx.fillRect(x, H - TILE, TILE, TILE);
            ctx.strokeStyle = "#8b3a2a";
            ctx.strokeRect(x, H - TILE, TILE, TILE);
        }
        // 平台
        ctx.fillStyle = "#8b7355";
        for (const p of platforms) {
            if (p.y === H - TILE)
                continue;
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.strokeStyle = "#5c4033";
            ctx.strokeRect(p.x, p.y, p.w, p.h);
        }
        // 水管
        ctx.fillStyle = "#2d8a2d";
        for (const p of pipes) {
            ctx.fillRect(p.x, p.y, p.w, p.h);
            ctx.fillStyle = "#1a5a1a";
            ctx.fillRect(p.x + 4, p.y, 12, p.h);
            ctx.fillRect(p.x + p.w - 16, p.y, 12, p.h);
            ctx.fillStyle = "#2d8a2d";
        }
        // 问号砖块
        for (const q of questionBlocks) {
            ctx.fillStyle = q.hit ? "#8b7355" : "#e8b828";
            ctx.fillRect(q.rect.x, q.rect.y, q.rect.w, q.rect.h);
            if (!q.hit) {
                ctx.fillStyle = "#5c4033";
                ctx.font = "bold 20px Arial";
                ctx.fillText("?", q.rect.x + 8, q.rect.y + 24);
            }
        }
        // 蘑菇道具绘制
        for (const m of mushrooms) {
            if (m.collected)
                continue;
            const mx2 = m.x;
            const my2 = m.y;
            // 红色菌盖
            ctx.fillStyle = "#e63946";
            ctx.beginPath();
            ctx.ellipse(mx2 + 14, my2 + 12, 14, 13, 0, 0, Math.PI * 2);
            ctx.fill();
            // 白色圆点
            ctx.fillStyle = "#fff";
            [[mx2 + 7, my2 + 7], [mx2 + 19, my2 + 7], [mx2 + 13, my2 + 3]].forEach(([dx, dy]) => {
                ctx.beginPath();
                ctx.arc(dx, dy, 4, 0, Math.PI * 2);
                ctx.fill();
            });
            // 米白色底部（脸）
            ctx.fillStyle = "#f5deb3";
            ctx.fillRect(mx2 + 4, my2 + 18, 20, 10);
            // 眼睛
            ctx.fillStyle = "#111";
            ctx.beginPath();
            ctx.arc(mx2 + 10, my2 + 23, 2.5, 0, Math.PI * 2);
            ctx.arc(mx2 + 18, my2 + 23, 2.5, 0, Math.PI * 2);
            ctx.fill();
        }
        // 敌人 (蘑菇怪 + 乌龟)
        for (const e of enemies) {
            if (e.dead)
                continue;
            const ex = e.x;
            const ey = e.y;
            if (e.type === "turtle") {
                // 乌龟 - 绿色壳+头脚
                ctx.fillStyle = "#2d8a2d";
                ctx.beginPath();
                ctx.ellipse(ex + e.w / 2, ey + e.h / 2, e.w / 2 - 2, e.h / 2 - 2, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#1a5a1a";
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.fillStyle = "#4ade80";
                ctx.beginPath();
                ctx.ellipse(ex + e.w / 2, ey + e.h / 2, e.w / 2 - 6, e.h / 2 - 6, 0, 0, Math.PI * 2);
                ctx.fill();
                const headX = e.vx > 0 ? ex + e.w - 4 : ex + 4;
                ctx.fillStyle = "#22c55e";
                ctx.beginPath();
                ctx.ellipse(headX, ey + e.h / 2, 5, 6, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#1a1a1a";
                ctx.beginPath();
                ctx.arc(headX + (e.vx > 0 ? 2 : -2), ey + e.h / 2 - 1, 2, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#166534";
                ctx.beginPath();
                ctx.ellipse(ex + 5, ey + e.h - 3, 4, 3, 0, 0, Math.PI * 2);
                ctx.ellipse(ex + e.w - 5, ey + e.h - 3, 4, 3, 0, 0, Math.PI * 2);
                ctx.fill();
            }
            else {
                // 蘑菇怪
                ctx.fillStyle = "#5c4033";
                ctx.beginPath();
                ctx.ellipse(ex + e.w / 2, ey + 10, e.w / 2 - 2, 12, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#3d2b1f";
                ctx.lineWidth = 1;
                ctx.stroke();
                ctx.fillStyle = "#6b4e3d";
                ctx.beginPath();
                ctx.ellipse(ex + e.w / 2, ey + 14, e.w / 2 - 1, 6, 0, Math.PI * 0.2, Math.PI * 0.8);
                ctx.fill();
                ctx.fillStyle = "#e8d5b7";
                ctx.beginPath();
                ctx.ellipse(ex + e.w / 2, ey + 20, e.w / 2 - 4, 10, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#fff";
                ctx.beginPath();
                ctx.ellipse(ex + 8, ey + 18, 5, 6, 0, 0, Math.PI * 2);
                ctx.ellipse(ex + e.w - 8, ey + 18, 5, 6, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.fillStyle = "#1a1a1a";
                ctx.beginPath();
                ctx.arc(ex + 8, ey + 19, 3, 0, Math.PI * 2);
                ctx.arc(ex + e.w - 8, ey + 19, 3, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = "#1a1a1a";
                ctx.lineWidth = 2;
                ctx.beginPath();
                if (e.vx > 0) {
                    ctx.moveTo(ex + 4, ey + 14);
                    ctx.lineTo(ex + 12, ey + 16);
                    ctx.moveTo(ex + e.w - 12, ey + 16);
                    ctx.lineTo(ex + e.w - 4, ey + 14);
                }
                else {
                    ctx.moveTo(ex + 4, ey + 16);
                    ctx.lineTo(ex + 12, ey + 14);
                    ctx.moveTo(ex + e.w - 12, ey + 14);
                    ctx.lineTo(ex + e.w - 4, ey + 16);
                }
                ctx.stroke();
                ctx.fillStyle = "#5c4033";
                ctx.beginPath();
                ctx.ellipse(ex + 6, ey + e.h - 2, 5, 4, 0, 0, Math.PI * 2);
                ctx.ellipse(ex + e.w - 6, ey + e.h - 2, 5, 4, 0, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        // 旗杆
        ctx.fillStyle = "#2d8a2d";
        ctx.fillRect(flagX, 0, 8, H - TILE);
        ctx.fillStyle = "#e63946";
        ctx.beginPath();
        ctx.moveTo(flagX + 8, 80);
        ctx.lineTo(flagX + 60, 100);
        ctx.lineTo(flagX + 8, 120);
        ctx.fill();
        // 马里奥
        const mx = mario.x - cameraX;
        if (mx > -50 && mx < W + 50) {
            ctx.save();
            const bx = mario.x;
            const by = mario.y;
            // 朝向翻转
            if (!mario.faceRight) {
                ctx.translate(bx + mario.w / 2, 0);
                ctx.scale(-1, 1);
                ctx.translate(-(bx + mario.w / 2), 0);
            }
            // 帽子（红色）
            ctx.fillStyle = "#e63946";
            ctx.fillRect(bx + 4, by, 18, 5); // 帽顶
            ctx.fillRect(bx + 1, by + 4, 25, 4); // 帽檐
            // 头发（棕色，帽檐侧面）
            ctx.fillStyle = "#7a3b10";
            ctx.fillRect(bx + 1, by + 6, 3, 4);
            // 脸（肤色）
            ctx.fillStyle = "#f4a261";
            ctx.fillRect(bx + 4, by + 6, 20, 10);
            // 耳朵
            ctx.fillRect(bx + 24, by + 8, 3, 5);
            // 眼睛
            ctx.fillStyle = "#fff";
            ctx.fillRect(bx + 16, by + 7, 6, 5);
            ctx.fillStyle = "#111";
            ctx.fillRect(bx + 19, by + 8, 3, 4);
            // 鼻子
            ctx.fillStyle = "#e08050";
            ctx.fillRect(bx + 13, by + 12, 8, 4);
            // 胡子（棕色，两撇）
            ctx.fillStyle = "#7a3b10";
            ctx.fillRect(bx + 7, by + 15, 8, 3);
            ctx.fillRect(bx + 16, by + 15, 8, 3);
            // 红色上衣
            ctx.fillStyle = "#e63946";
            ctx.fillRect(bx + 2, by + 18, 24, 5);
            // 蓝色背带裤
            ctx.fillStyle = "#2563eb";
            ctx.fillRect(bx + 2, by + 22, 24, 10);
            // 背带
            ctx.fillRect(bx + 7, by + 18, 5, 5);
            ctx.fillRect(bx + 16, by + 18, 5, 5);
            // 黄色纽扣
            ctx.fillStyle = "#facc15";
            ctx.fillRect(bx + 11, by + 24, 3, 3);
            ctx.fillRect(bx + 16, by + 24, 3, 3);
            // 棕色鞋子
            ctx.fillStyle = "#7a3b10";
            ctx.fillRect(bx, by + 29, 13, 3);
            ctx.fillRect(bx + 15, by + 29, 13, 3);
            ctx.restore();
        }
        ctx.restore();
        // UI
        ctx.fillStyle = "#000";
        ctx.font = "14px monospace";
        ctx.fillText(`得分: ${score}  金币: ${coins}  生命: ${lives}`, 10, 20);
    }
    function loop() {
        update();
        draw();
        requestAnimationFrame(loop);
    }
    startBtn.addEventListener("click", () => {
        startOverlay.classList.add("hidden");
        gameOverOverlay.classList.add("hidden");
        winOverlay.classList.add("hidden");
        resetGame();
        window.SunsetMusic?.play();
    });
    restartBtn.addEventListener("click", () => {
        gameOverOverlay.classList.add("hidden");
        resetGame(true);
    });
    document.getElementById("winRestartBtn")?.addEventListener("click", () => {
        winOverlay.classList.add("hidden");
        resetGame(true);
    });
    canvas.width = W;
    canvas.height = H;
    requestAnimationFrame(loop);
}
