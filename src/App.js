import { useState, useEffect } from "react";
import './App.css'

function App() {
  const [quote, setQuote] = useState({text: 'In the Name of Allah, the Most Beneficent, the Most Merciful.', author: 'Anonymous'});
  const [loading, setLoading] = useState(false);
  const [colorTheme, setColorTheme] = useState('#202124');

  const updateQuote = (data) => {
    setQuote(data);
  };

  const updateColor = (color) => {
    setColorTheme(color);
  };
  
  const updateLoading = (boolean) => {
    setLoading(boolean);
  };

  const getRandomColor = () => {
    const minBrightness = 0; // Adjust this threshold as needed
    let randomColor;
    let brightness;

    do {
      // Generate a random number between 0 and 16777215
      randomColor = Math.floor(Math.random() * 16777215).toString(16);

      // Ensure that the hex code has six digits by padding with zeros if necessary
      while (randomColor.length < 6) {
        randomColor = '0' + randomColor;
      }

      // Calculate the brightness of the color
      brightness =
        (parseInt(randomColor.substring(0, 2), 16) * 299 +
          parseInt(randomColor.substring(2, 4), 16) * 587 +
          parseInt(randomColor.substring(4, 6), 16) * 114) /
        1000;

      // Repeat until a color with sufficient darkness is generated
    } while (brightness < minBrightness);

    return '#' + randomColor;
  }

  const generateQuote = async () => {
    updateLoading(true);
    await fetch('https://api.quotable.io/quotes/random')
    .then(res => res.json())
    .then(data => {
      updateQuote({text: data[0].content, author: data[0].author})
    })
    .catch(err => console.error(err))
    .finally(() => {
      updateLoading(false);
      const randomColor = getRandomColor();
      updateColor(randomColor);
    });
  }

  return (
    <div className="App">
      <div className="center" style={{
        backgroundColor: colorTheme
      }}>
        <div id="quote-box">
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            gap: '0.7rem'
          }}>
            <div id="text" style={{
              opacity: loading ? 0 : 1,
              color: colorTheme
            }}>
              <span style={{ marginRight: '0.7rem' }}>
                <i class="fa fa-quote-left"></i>
              </span>
              {quote.text}
            </div>
          </div>
          <div id="author" style={{
              opacity: loading ? 0 : 1,
              color: colorTheme
            }}>
            - {quote.author}
          </div>
          <br />
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <a id="tweet-quote" href={"https://twitter.com/intent/tweet?text=" + quote.text} style={{ backgroundColor: colorTheme }} target="_blank"><i class="fa fa-twitter"></i></a>
            <button id="new-quote" style={{ backgroundColor: colorTheme }} disabled={loading} onClick={() => generateQuote()}>New Quote</button>
          </div>
        </div>
        
      </div>
    </div>
  );
}

export default App;
