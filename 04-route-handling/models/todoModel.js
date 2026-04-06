import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

// Prevent overwrite error
const Todo = mongoose.models.Todo || mongoose.model("Todo", todoSchema);

export default Todo;
