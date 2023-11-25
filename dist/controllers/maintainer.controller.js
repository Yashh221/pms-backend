"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSubmissions = exports.approveTaskStatus = exports.assignWork = exports.approvedTask = exports.pendingTask = exports.searchTask = exports.deleteTask = exports.getAllTasks = exports.createTask = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const tasks_model_1 = require("../models/tasks.model");
///////////---------------------------- MAINTAINER TASK API'S --------------------------------------//////////
exports.createTask = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, deadline, labels, assignee, status } = req.body;
        if (!name || !description || !deadline || !labels || !status) {
            res.status(400).json({ message: "Please fill all the task details" });
            return;
        }
        let newTask = yield tasks_model_1.Task.create({
            name,
            description,
            deadline,
            labels,
            status,
            assignee,
        });
        if (assignee) {
            newTask = yield newTask.populate("assignee", "-password");
        }
        res
            .status(200)
            .json({ message: "Task Added Successfully", data: newTask });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
exports.getAllTasks = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let allTask = yield tasks_model_1.Task.find().populate("assignee");
        if (!allTask) {
            res.status(400).json({ message: "No Tasks to display!" });
            return;
        }
        res.status(200).json({ data: allTask });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
exports.deleteTask = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.body;
        if (!taskId) {
            res.status(400).json({ message: "Unable to find the task!" });
        }
        let tasks = yield tasks_model_1.Task.findByIdAndDelete(taskId, {
            new: true,
        });
        res
            .status(200)
            .json({ message: "Task Deleted Successfully!", data: tasks });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
exports.searchTask = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { keyword, status } = req.query;
        const searchQuery = {};
        if (keyword) {
            const keywordAsString = keyword;
            searchQuery.$or = [
                { name: { $regex: new RegExp(keywordAsString, "i") } },
                { description: { $regex: new RegExp(keywordAsString, "i") } },
            ];
        }
        if (status) {
            searchQuery.status = status;
        }
        const tasks = yield tasks_model_1.Task.find(searchQuery).populate("assignee", "-password");
        res.status(200).json({ data: tasks });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
exports.pendingTask = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pendingTasks = yield tasks_model_1.Task.find({ status: "pending" }).populate("assignee", "-password");
        if (!pendingTasks) {
            res.status(400).json({ message: "No Pending Tasks" });
            return;
        }
        res.status(200).json({ message: "success", data: pendingTasks });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
exports.approvedTask = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const approvedTasks = yield tasks_model_1.Task.find({ status: "approved" }).populate("assignee", "-password");
        if (!approvedTasks) {
            res.status(400).json({ message: "No Approved Tasks" });
            return;
        }
        res.status(200).json({ message: "success", data: approvedTasks });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
exports.assignWork = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId, userId } = req.body;
        if (!userId || !taskId) {
            res.status(400).json({ message: "No Assignee or Task Found!" });
            return;
        }
        let task = yield tasks_model_1.Task.findByIdAndUpdate(taskId, {
            assignee: userId,
        }, {
            new: true,
        });
        if (task) {
            task = yield task.populate("assignee", "-password");
        }
        res
            .status(200)
            .json({ message: "Task Assigned Successfully!", data: task });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
exports.approveTaskStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { taskId } = req.body;
        if (!taskId) {
            res.status(400).json({ message: "No task found!" });
            return;
        }
        const task = yield tasks_model_1.Task.findByIdAndUpdate(taskId, {
            status: "approved",
        }, {
            new: true,
        }).populate("assignee", "-password");
        res.status(200).json({ message: "success", data: task });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
exports.getSubmissions = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield tasks_model_1.Task.find({
            submission: {
                $exists: true,
                $ne: null,
            },
        }).populate("assignee", "-password");
        res.status(200).json({ message: "success", tasks });
    }
    catch (error) {
        res.status(500).json({ message: error });
    }
}));
