const router = require("express").Router();
const User = require("../models/user");
const Task = require("../models/task");
const { authenticateToken } = require("./userAuth");

router.post("/add-task", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const task = new Task({
      title: req.body.title,
    });

    await User.findByIdAndUpdate(id, { $push: { tasks: task._id } });
    await task.save();

    res.status(200).json({ message: "task added successfully", data: task });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/mark-completed", authenticateToken, async (req, res) => {
  try {
    const { taskid } = req.headers;

    await Task.findByIdAndUpdate(taskid, {
      isCompleted: req.body.mark,
    });

    return res.status(200).json({
      message: "task marked completed successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.delete("/delete-task", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { taskid } = req.headers;

    await User.findByIdAndUpdate(id, { $pull: { tasks: taskid } });

    await Task.findByIdAndDelete(taskid);

    return res.status(200).json({
      message: "Task deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.get("/get-all-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("tasks");
    const tasks = userData.tasks;

    return res.json({
      status: "Success",
      data: tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
