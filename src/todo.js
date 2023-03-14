import React, { useState, useEffect } from "react";
import { Helmet } from "fusion-plugin-react-helmet-async";
import fetch from "isomorphic-fetch";

const Root = () => {
  const [todos, setTodos] = useState([]);
  const [inputText, setInputText] = useState("");

  const handleOnKeydown = (e) => {
    if (e.key === "Enter") {
      setInputText("");
      setTodos([...todos, inputText]);
      fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ value: inputText }),
      });
    }
  };

  const handleOnChange = (e) => {
    setInputText(e.currentTarget.value);
  };

  useEffect(() => {
    fetch("/api/todos")
      .then(async (res) => await res.json())
      .then((res) => setTodos(res));
  }, []);

  return (
    <React.Fragment>
      <Helmet>
        <style>
          {`
        body {
          background-color: #f5f5f5;
          font: 24px 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        h1 {
          color: rgba(175, 47, 47, 0.15);
          font-size: 100px;
          font-weight: 100;
          text-align: center;
        }
        .container {
          background: #ffffff;
          border: 1px solid #ededed;
          margin: 0 auto;
          width: 550px;
        }
        input {
          border: none;
          font-size: 24px;
          font-weight: 300;
          padding: 15px;
          width: 520px;
        }
        input::placeholder {
          color: #e6e6e6;
          font-style: italic;
          font-weight: 100;
        }
        .todo {
          border-top: 1px solid #ededed;
          padding: 15px;
        }
        .todo-text {
          font-weight: 300;
        }
      `}
        </style>
      </Helmet>
      <h1>todos</h1>
      <div className="container">
        <input
          onChange={handleOnChange}
          onKeyDown={handleOnKeydown}
          placeholder="What needs to be done?"
          value={inputText}
          type="text"
        />
        {todos.map((todo) => (
          <div className="todo">
            <div className="todo-text">{todo}</div>
          </div>
        ))}
      </div>
    </React.Fragment>
  );
};

export default <Root />;
