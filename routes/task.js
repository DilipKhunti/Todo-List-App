const router = require("express").Router();
const User = require("../models/user");
const Task = require("../models/task");
const { authenticateToken } = require("./userAuth");

router.post("/add-task", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const task = new Task({
      title: req.body.title,
      uploader_id: id,
    });

    await task.save();
    res.status(200).json({ message: "task added successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/mark-completed", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { taskid } = req.headers;

    const task = await Task.findById(taskid);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.uploader_id !== id) {
      return res
        .status(403)
        .json({ message: "You don't have permission to update this task" });
    }

    await Task.findByIdAndUpdate(taskid, {
      isCompleated: true,
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

    const task = await Task.findById(taskid);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.uploader_id !== id) {
      return res
        .status(403)
        .json({ message: "You don't have permission to delete this task" });
    }

    await Task.findByIdAndDelete(taskid);

    return res.status(200).json({
      message: "Task deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

router.get("/get-uploaded-tasks", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;

    const tasks = await Task.find({ uploader_id: id })

    return res.status(200).json({
      status: "Success",
      data: tasks,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "An error occurred" });
  }
});

module.exports = router;
