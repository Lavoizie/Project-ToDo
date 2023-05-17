import { useEffect, useState } from 'react';
import { BsBookmarkCheckFill, BsBookmarkCheck, BsTrash } from "react-icons/bs";
import './App.css';

const API = "http://localhost:5000";

function App() {

  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState (false);

  //Load todos on page load

  useEffect (() => {
    const loadData = async () => {
      setLoading(true)

      const res = await fetch(API + "/todos")
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err));

        setLoading(false);

        setTodos(res);
    };

    loadData();
  }, [] );

//Metodo enviar informações do projeto a ser criado no db.json através do submit
  const handleSubmit = async (e) => {
      e.preventDefault();

      const todo ={
        id: Math.random(),
        title,
        time,
        done: false,
      }

      await fetch(API + "/todos", {
        method: "POST",
        body: JSON.stringify(todo),
        headers: {
          "Content-Type": "Application/json",
        },
      });

      setTodos((prevState) => [...prevState, todo]);

      setTitle("");
      setTime("");
  }

//Metodo para excluir projeto no db.json
  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/todos/${id}`, {
      method: "DELETE",
    });

    setTodos ( (prevState) => prevState.filter((todo) => todo.id !== id));
  };

  if(loading) {
    return <p>Carregando tarefas...</p>;
  }

  return (
    <div className="App">
      <div className="todo-header">
          <h1>React Todo</h1>
      </div>
      <div className="form-todo" >
        <h2>Insira a sua próxima tarefa</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-control">
              <label htmlFor='title' >O que você vai fazer?</label>
              <input type="text" name="title" placeholder="Título da tarefa"
                      onChange={(e)=> setTitle(e.target.value)}
                      value={title || "" }
                      required
                      />
          </div>
          <div className="form-control">
              <label htmlFor='time' >Duração</label>
              <input type="text" name="time" placeholder="Tempo estimado (em horas)"
                      onChange={(e)=> setTime(e.target.value)}
                      value={time || "" }
                      required
                      />
          </div>
          <input type="submit" value="Criar tarefa" />
        </form>
      </div>
      <div className="list-todo" >
        <h2>Lista de tarefas</h2>
        {todos.length ===0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className="todo" key={todo.id} >
            <h3 className={todo.done ? "todo-done": ""} >{todo.title}</h3>
            <p>Duração: {todo.time}</p>
                <div>
                  <span>
                    {!todo.done ? < BsBookmarkCheck />: < BsBookmarkCheckFill /> }
                  </span>
                  <BsTrash onClick={() => handleDelete(todo.id)} />
                </div>
          </div>
        ) ) }
      </div>
    </div>
  );
}

export default App;