import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState, useEffect } from "react";
import bookChapters from "../public/MobyDick.json";

export default function Home() {
  const [data, setData] = useState(null);
  const [response, setResponse] = useState([""]);
  const [searchTerm, setSearchTerm] = useState([""]);

  useEffect(() => {
    async function fetchData() {
      const reverseIndex = {};
      for (let i = 0; i < bookChapters.length; i++) {
        for (let j = 0; j < bookChapters[i].paragraphs.length; j++) {
          const words = bookChapters[i].paragraphs[j].split(" ");
          for (let w = 0; w < words.length; w++) {
            const wordIndex = words[w]
              .toLowerCase()
              .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "");

            if (!reverseIndex[wordIndex]) {
              reverseIndex[wordIndex] = [
                `Chapter ${i + 1} - Paragraph ${j + 1}<br/>${
                  bookChapters[i].paragraphs[j]
                }`,
              ];
            } else {
              reverseIndex[wordIndex].push(
                `Chapter ${i + 1} - Paragraph ${j + 1}<br/>${
                  bookChapters[i].paragraphs[j]
                }`,
              );
            }
          }
        }
      }
      setData(reverseIndex);
    }
    fetchData();
  }, []);

  const searchAction = async () => {
    try {
      setResponse(
        data[searchTerm].map((paragraph) =>
          paragraph.replace(searchTerm, `<strong>${searchTerm}</strong>`),
        ),
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Moby Dick Search</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <span>Search term:&nbsp;&nbsp;</span>
          <input
            type="text"
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            onKeyUp={(e) =>
              e.key === "Enter" || e.keyCode === 13 ? searchAction() : null
            }
            value={searchTerm}
          />
          <button onClick={searchAction}>Search</button>
        </div>

        <br />
        <div
          id="results"
          dangerouslySetInnerHTML={{ __html: response.join("<br /><br />") }}
        ></div>
      </main>
      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
