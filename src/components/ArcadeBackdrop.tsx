import allamaSprite from "../assets/allama.png";
import llamaSprite from "../assets/llama.png";

type BackdropSprite = {
  id: number;
  image: string;
  top: string;
  left: string;
  animationClass: "arcade-jitter" | "arcade-bounce";
  delay: number;
};

const SPRITE_SIZE = 60;

const sprites: BackdropSprite[] = [
  {
    id: 1,
    image: allamaSprite,
    top: "6%",
    left: "8%",
    animationClass: "arcade-jitter",
    delay: 0,
  },
  {
    id: 2,
    image: llamaSprite,
    top: "8%",
    left: "28%",
    animationClass: "arcade-bounce",
    delay: 0.2,
  },
  {
    id: 3,
    image: allamaSprite,
    top: "7%",
    left: "48%",
    animationClass: "arcade-jitter",
    delay: 0.4,
  },
  {
    id: 4,
    image: llamaSprite,
    top: "9%",
    left: "68%",
    animationClass: "arcade-bounce",
    delay: 0.1,
  },
  {
    id: 5,
    image: allamaSprite,
    top: "8%",
    left: "86%",
    animationClass: "arcade-jitter",
    delay: 0.3,
  },

  {
    id: 6,
    image: llamaSprite,
    top: "30%",
    left: "14%",
    animationClass: "arcade-bounce",
    delay: 0.5,
  },
  {
    id: 7,
    image: allamaSprite,
    top: "32%",
    left: "34%",
    animationClass: "arcade-jitter",
    delay: 0.2,
  },
  {
    id: 8,
    image: llamaSprite,
    top: "29%",
    left: "54%",
    animationClass: "arcade-bounce",
    delay: 0.6,
  },
  {
    id: 9,
    image: allamaSprite,
    top: "31%",
    left: "74%",
    animationClass: "arcade-jitter",
    delay: 0.1,
  },

  {
    id: 10,
    image: llamaSprite,
    top: "54%",
    left: "8%",
    animationClass: "arcade-jitter",
    delay: 0.4,
  },
  {
    id: 11,
    image: allamaSprite,
    top: "56%",
    left: "28%",
    animationClass: "arcade-bounce",
    delay: 0.2,
  },
  {
    id: 12,
    image: llamaSprite,
    top: "53%",
    left: "48%",
    animationClass: "arcade-jitter",
    delay: 0.5,
  },
  {
    id: 13,
    image: allamaSprite,
    top: "55%",
    left: "68%",
    animationClass: "arcade-bounce",
    delay: 0.3,
  },
  {
    id: 14,
    image: llamaSprite,
    top: "57%",
    left: "86%",
    animationClass: "arcade-jitter",
    delay: 0.1,
  },

  {
    id: 15,
    image: allamaSprite,
    top: "78%",
    left: "16%",
    animationClass: "arcade-bounce",
    delay: 0.4,
  },
  {
    id: 16,
    image: llamaSprite,
    top: "80%",
    left: "38%",
    animationClass: "arcade-jitter",
    delay: 0.2,
  },
  {
    id: 17,
    image: allamaSprite,
    top: "79%",
    left: "60%",
    animationClass: "arcade-bounce",
    delay: 0.5,
  },
  {
    id: 18,
    image: llamaSprite,
    top: "81%",
    left: "82%",
    animationClass: "arcade-jitter",
    delay: 0.3,
  },
];

export default function ArcadeBackdrop() {
  return (
    <div className="arcade-backdrop" aria-hidden="true">
      {sprites.map((sprite) => (
        <img
          key={sprite.id}
          src={sprite.image}
          alt=""
          className={`arcade-sprite ${sprite.animationClass}`}
          style={{
            top: sprite.top,
            left: sprite.left,
            width: `${SPRITE_SIZE}px`,
            height: "auto",
            animationDelay: `${sprite.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
