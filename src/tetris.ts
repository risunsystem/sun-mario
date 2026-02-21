// 俄罗斯方块 - 7 种方块形状 (每个形状 4 个旋转状态)
const SHAPES: number[][][] = [
  [[1, 1, 1, 1]], // I
  [
    [1, 1],
    [1, 1],
  ], // O
  [
    [0, 1, 0],
    [1, 1, 1],
  ], // T
  [
    [0, 1, 1],
    [1, 1, 0],
  ], // S
  [
    [1, 1, 0],
    [0, 1, 1],
  ], // Z
  [
    [1, 0, 0],
    [1, 1, 1],
  ], // J
  [
    [0, 0, 1],
    [1, 1, 1],
  ], // L
];

const COLORS = [
  "#00f5ff", // I - 青
  "#ffff00", // O - 黄
  "#bf00ff", // T - 紫
  "#00ff00", // S - 绿
  "#ff0000", // Z - 红
  "#0000ff", // J - 蓝
  "#ff8c00", // L - 橙
];

const COLS = 10;
const ROWS = 20;
const CELL_SIZE = 24;

type Position = { x: number; y: number };

class Tetromino {
  shape: number[][];
  color: string;
  x: number;
  y: number;

  constructor(typeIndex: number) {
    this.shape = SHAPES[typeIndex].map((row) => [...row]);
    this.color = COLORS[typeIndex];
    this.x = Math.floor(COLS / 2) - Math.ceil(this.shape[0].length / 2);
    this.y = 0;
  }

  rotate(): number[][] {
    const rows = this.shape.length;
    const cols = this.shape[0].length;
    const rotated: number[][] = [];
    for (let c = 0; c < cols; c++) {
      rotated[c] = [];
      for (let r = rows - 1; r >= 0; r--) {
        rotated[c].push(this.shape[r][c]);
      }
    }
    return rotated;
  }

  getCells(): Position[] {
    const cells: Position[] = [];
    this.shape.forEach((row, dy) => {
      row.forEach((val, dx) => {
        if (val) cells.push({ x: this.x + dx, y: this.y + dy });
      });
    });
    return cells;
  }
}

export class TetrisGame {
  private canvas: HTMLCanvasElement;
  private nextCanvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private nextCtx: CanvasRenderingContext2D;
  private grid: (string | null)[][] = [];
  private current: Tetromino | null = null;
  private next: Tetromino | null = null;
  private score = 0;
  private level = 1;
  private lines = 0;
  private gameOver = false;
  private dropInterval = 1000;
  private lastDrop = 0;
  private animationId = 0;

  private scoreEl: HTMLElement;
  private levelEl: HTMLElement;
  private linesEl: HTMLElement;
  private highScoreEl: HTMLElement;
  private startOverlay: HTMLElement;
  private gameOverOverlay: HTMLElement;
  private finalScoreEl: HTMLElement;
  private startBtn: HTMLButtonElement;
  private restartBtn: HTMLButtonElement;

  private highScore = parseInt(localStorage.getItem("tetrisHighScore") ?? "0", 10);

  constructor() {
    this.canvas = document.getElementById("canvas") as HTMLCanvasElement;
    this.nextCanvas = document.getElementById("nextCanvas") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.nextCtx = this.nextCanvas.getContext("2d")!;

    this.scoreEl = document.getElementById("score")!;
    this.levelEl = document.getElementById("level")!;
    this.linesEl = document.getElementById("lines")!;
    this.highScoreEl = document.getElementById("highScore")!;
    this.startOverlay = document.getElementById("startOverlay")!;
    this.gameOverOverlay = document.getElementById("gameOverOverlay")!;
    this.finalScoreEl = document.getElementById("finalScore")!;
    this.startBtn = document.getElementById("startBtn") as HTMLButtonElement;
    this.restartBtn = document.getElementById("restartBtn") as HTMLButtonElement;

    this.canvas.width = COLS * CELL_SIZE;
    this.canvas.height = ROWS * CELL_SIZE;
    this.nextCanvas.width = 5 * CELL_SIZE;
    this.nextCanvas.height = 4 * CELL_SIZE;

    this.highScoreEl.textContent = String(this.highScore);
    this.startBtn.addEventListener("click", () => this.start());
    this.restartBtn.addEventListener("click", () => this.start());
    document.addEventListener("keydown", (e) => this.handleKey(e));
  }

  private spawnPiece(): Tetromino | null {
    const type = Math.floor(Math.random() * 7);
    const piece = new Tetromino(type);
    if (this.collides(piece)) return null;
    return piece;
  }

  private collides(piece: Tetromino): boolean {
    return piece.getCells().some(({ x, y }) => {
      if (x < 0 || x >= COLS || y >= ROWS) return true;
      if (y >= 0 && this.grid[y][x]) return true;
      return false;
    });
  }

  private mergePiece(): void {
    if (!this.current) return;
    this.current.getCells().forEach(({ x, y }) => {
      if (y >= 0) this.grid[y][x] = this.current!.color;
    });
  }

  private clearLines(): number {
    let cleared = 0;
    for (let y = ROWS - 1; y >= 0; y--) {
      if (this.grid[y].every((c) => c !== null)) {
        this.grid.splice(y, 1);
        this.grid.unshift(Array(COLS).fill(null));
        cleared++;
        y++;
      }
    }
    return cleared;
  }

  private addScore(lines: number): void {
    const points = [0, 100, 300, 500, 800][lines];
    this.score += points * this.level;
    this.lines += lines;
    if (this.lines >= this.level * 10) {
      this.level++;
      this.dropInterval = Math.max(100, 1000 - (this.level - 1) * 100);
    }
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem("tetrisHighScore", String(this.highScore));
    }
  }

  private lockPiece(): void {
    if (!this.current) return;
    this.mergePiece();
    const cleared = this.clearLines();
    this.addScore(cleared);
    this.updateUI();

    this.current = this.next;
    this.next = this.spawnPiece() ?? null;
    if (!this.current) {
      this.current = this.next;
      this.next = this.spawnPiece() ?? null;
    }
    if (!this.current) {
      this.gameOver = true;
      this.finalScoreEl.textContent = String(this.score);
      this.gameOverOverlay.classList.remove("hidden");
      cancelAnimationFrame(this.animationId);
    }
  }

  private move(dir: number): boolean {
    if (!this.current || this.gameOver) return false;
    this.current.x += dir;
    if (this.collides(this.current)) {
      this.current.x -= dir;
      return false;
    }
    return true;
  }

  private rotate(): boolean {
    if (!this.current || this.gameOver) return false;
    const rotated = this.current.rotate();
    const prev = this.current.shape;
    this.current.shape = rotated;
    if (this.collides(this.current)) {
      this.current.shape = prev;
      return false;
    }
    return true;
  }

  private softDrop(): boolean {
    if (!this.current || this.gameOver) return false;
    this.current.y++;
    if (this.collides(this.current)) {
      this.current.y--;
      this.lockPiece();
      return false;
    }
    this.score += 1;
    this.updateUI();
    return true;
  }

  private hardDrop(): void {
    if (!this.current || this.gameOver) return;
    while (this.softDrop()) {}
  }

  private handleKey(e: KeyboardEvent): void {
    if (this.gameOver) return;
    switch (e.key) {
      case "ArrowLeft":
      case "a":
      case "A":
        this.move(-1);
        e.preventDefault();
        break;
      case "ArrowRight":
      case "d":
      case "D":
        this.move(1);
        e.preventDefault();
        break;
      case "ArrowDown":
      case "s":
      case "S":
        this.softDrop();
        e.preventDefault();
        break;
      case "ArrowUp":
      case "w":
      case "W":
        this.rotate();
        e.preventDefault();
        break;
      case " ":
        this.hardDrop();
        e.preventDefault();
        break;
    }
  }

  private updateUI(): void {
    this.scoreEl.textContent = String(this.score);
    this.levelEl.textContent = String(this.level);
    this.linesEl.textContent = String(this.lines);
    this.highScoreEl.textContent = String(this.highScore);
  }

  private drawBlock(
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    size: number = CELL_SIZE
  ): void {
    const padding = 2;
    ctx.fillStyle = color;
    ctx.fillRect(x * size + padding, y * size + padding, size - padding, size - padding);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(x * size + padding, y * size + padding, size - padding, 4);
  }

  private draw(): void {
    this.ctx.fillStyle = "#0d0d12";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.grid.forEach((row, y) => {
      row.forEach((color, x) => {
        if (color) this.drawBlock(this.ctx, x, y, color);
      });
    });

    if (this.current) {
      this.current.getCells().forEach(({ x, y }) => {
        if (y >= 0) this.drawBlock(this.ctx, x, y, this.current!.color);
      });
    }

    this.nextCtx.fillStyle = "#0d0d12";
    this.nextCtx.fillRect(0, 0, this.nextCanvas.width, this.nextCanvas.height);
    if (this.next) {
      const offsetX = (5 - this.next.shape[0].length) / 2;
      const offsetY = (4 - this.next.shape.length) / 2;
      this.next.shape.forEach((row, dy) => {
        row.forEach((val, dx) => {
          if (val) this.drawBlock(this.nextCtx, offsetX + dx, offsetY + dy, this.next!.color);
        });
      });
    }
  }

  private gameLoop(timestamp: number): void {
    if (this.gameOver) return;
    if (timestamp - this.lastDrop > this.dropInterval) {
      if (!this.softDrop()) this.lastDrop = timestamp;
      this.lastDrop = timestamp;
    }
    this.draw();
    this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
  }

  start(): void {
    this.grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.gameOver = false;
    this.dropInterval = 1000;
    this.lastDrop = 0;
    this.next = this.spawnPiece();
    this.current = this.spawnPiece();
    if (!this.current) {
      this.current = this.next;
      this.next = this.spawnPiece();
    }

    this.startOverlay.classList.add("hidden");
    this.gameOverOverlay.classList.add("hidden");
    this.updateUI();
    this.lastDrop = performance.now();
    this.animationId = requestAnimationFrame((t) => this.gameLoop(t));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new TetrisGame();
});
