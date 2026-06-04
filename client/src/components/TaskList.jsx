import TaskItem from './TaskItem.jsx';

/** Renders the list of tasks. */
export default function TaskList({ tasks, onToggle, onUpdate, onDelete }) {
  return (
    <ul className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
