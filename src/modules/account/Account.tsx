import { FormatQuote, FormatQuoteRounded } from "@mui/icons-material";
import Register from "./Register";
import Login from "./Login";

const quotes = [
  {
    author: "Franz Kafka",
    text: "Don't bend; don't water it down; don't try to make it logical; don't edit your own soul according to the fashion. Rather, follow your most intense obsessions mercilessly.",
  },
];

export const Signin = () => {
  const quote = quotes[0];
  return (
    <div className="w-full h-full overflow-hidden grid grid-cols-[1fr_2fr] gap-2">
      <div className="h-full">
        <Login />
      </div>
      <div className="h-full relative">
        <img
          className="h-full w-full object-cover rounded-tl-[80px]"
          src="/signup-image.png"
        />
        <div
          className="absolute bottom-0 left-0 z-10 text-white flex flex-col items-start p-10"
          style={{ background: "rgba(0,0,0,0.8)" }}
        >
          <div className="text-3xl rotate-180">
            <FormatQuoteRounded fontSize="large" />
          </div>
          <div
            className="text-3xl mt-1 font-semibold"
            style={{ letterSpacing: "-1.5px" }}
          >
            {quote.text}
          </div>
          <div className="text-xl font-bold mt-5">{quote.author}</div>
        </div>
      </div>
    </div>
  );
};

export const Signup = () => {
  const quote = quotes[0];
  return (
    <div className="w-full h-full overflow-hidden grid grid-cols-[1fr_2fr] gap-2">
      <div className="h-full">
        <Register />
      </div>
      <div className="h-full relative">
        <img
          className="h-full w-full object-cover rounded-tl-[80px]"
          src="/signup-image.png"
        />
        <div
          className="absolute bottom-0 left-0 z-10 text-white flex flex-col items-start p-10"
          style={{ background: "rgba(0,0,0,0.8)" }}
        >
          <div className="text-3xl rotate-180">
            <FormatQuoteRounded fontSize="large" />
          </div>
          <div
            className="text-3xl mt-1 font-semibold"
            style={{ letterSpacing: "-1.5px" }}
          >
            {quote.text}
          </div>
          <div className="text-xl font-bold mt-5">{quote.author}</div>
        </div>
      </div>
    </div>
  );
};
