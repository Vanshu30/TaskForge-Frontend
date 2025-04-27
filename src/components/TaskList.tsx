import { useEffect, useState } from 'react';

type Task = {
  id: number;
  title: string;
  description: string;
};

const TaskList = () => {
  // State to hold the fetched tasks
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Function to fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      // Make the GET request to the backend API
      const response = await fetch('https://taskforge-backend-pdg6.onrender.com/api/tasks');
      
      // Check if the response is successful (status code 200)
      if (response.ok) {
        const data = await response.json(); // Parse the JSON response
        setTasks(data); // Store the data in state
      } else {
        // Handle the case where the response status is not OK
        setError('Failed to fetch tasks');
      }
    } catch (error) {
      // Catch any error that occurs during the fetch request
      setError('Error fetching tasks');
    } finally {
      setLoading(false); // Stop loading after the request completes
    }
  };

  // UseEffect hook to call fetchTasks when the component mounts
  useEffect(() => {
    fetchTasks(); // Fetch tasks on component mount
  }, []); // Empty dependency array ensures this runs once after the first render

  // Render loading state, error state, or the tasks
  if (loading) {
    return <div>Loading tasks...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Task List</h1>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <h3>{task.title}</h3>
            <p>{task.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
