"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSnackbar } from "@/hooks/useSnackbar"
import { fetchProject } from "@/services/projectService"
import { fetchTasks, updateTask } from "@/services/taskService"
import type { SelectChangeEvent } from "@mui/material/Select"
import {
    Box,
    Typography,
    Paper,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    CircularProgress,
    FormHelperText,
} from "@mui/material"
import type { Project, Technology, RiskLevel } from "@/types"
import Link from "next/link"

export default function EditTask() {
    const params = useParams();
    const projectId = typeof params.projectId === "string" ? params.projectId : "";
    const taskId = typeof params.taskId === "string" ? params.taskId : "";
    const [formData, setFormData] = useState({
        task_id: taskId,
        name: "",
        description: "",
        technology: "" as Technology,
        risk_level: "" as unknown as RiskLevel,
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const { showSnackbar } = useSnackbar();
    const router = useRouter();

    useEffect(() => {
        const loadTask = async () => {
            try {
                if (typeof projectId !== "string" || typeof taskId !== "string") {
                    throw new Error("Invalid projectId or taskId");
                }
                const tasks = await fetchTasks(projectId);
                const taskData = tasks.find((task: { task_id: string }) => task.task_id === taskId);
                if (!taskData) {
                    throw new Error("Task not found");
                }
                setFormData({
                    task_id: taskData.task_id,
                    name: taskData.name,
                    description: taskData.description,
                    technology: taskData.technology,
                    risk_level: taskData.risk_level,
                });
            } catch (error) {
                showSnackbar("Failed to load task details", "error");
                router.push("/projects");
            }
        };

        loadTask();
    }, [projectId, taskId, showSnackbar, router]);

    const validate = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name) {
            newErrors.name = "Task name is required";
        } else if (formData.name.length < 3 || formData.name.length > 100) {
            newErrors.name = "Task name must be between 3 and 100 characters";
        }

        if (!formData.technology) {
            newErrors.technology = "Technology is required";
        }

        if (!formData.risk_level) {
            newErrors.risk_level = "Risk level is required";
        }

        if (formData.description && formData.description.length > 500) {
            newErrors.description = "Description must be less than 500 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name as string]: value,
        });
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            setLoading(true);
            // Add missing properties with default values to satisfy Task type
            await updateTask(projectId, {
                ...formData,
                risk_level: Number(formData.risk_level) as RiskLevel,
                completed: false,
                ignored: false,
            });
            showSnackbar("Task updated successfully!", "success");
            router.push(`/projects/${projectId}`);
        } catch (error) {
            showSnackbar("Failed to update task. Please try again.", "error");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", py: 4 }}>
            <Paper sx={{ p: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Edit Task
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
                    <TextField
                        fullWidth
                        required
                        label="Task ID (only numbers)"
                        name="task_id"
                        value={formData.task_id}
                        onChange={handleChange}
                        disabled
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        required
                        label="Task Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        margin="normal"
                    />

                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        error={!!errors.description}
                        helperText={errors.description}
                        margin="normal"
                        multiline
                        rows={3}
                    />

                    <FormControl fullWidth margin="normal" error={!!errors.technology}>
                        <InputLabel id="technology-select-label">Technology</InputLabel>
                        <Select
                            labelId="technology-select-label"
                            id="technology-select"
                            name="technology"
                            value={formData.technology}
                            label="Technology"
                            onChange={handleChange}
                        >
                            <MenuItem value="wifi">WiFi</MenuItem>
                            <MenuItem value="uart">UART</MenuItem>
                            <MenuItem value="jtag">JTAG</MenuItem>
                            <MenuItem value="bluetooth">Bluetooth</MenuItem>
                            <MenuItem value="lte">LTE</MenuItem>
                            <MenuItem value="rfid">RFID</MenuItem>
                            <MenuItem value="nfc">NFC</MenuItem>
                            <MenuItem value="ant+">ANT+</MenuItem>
                            <MenuItem value="lifi">LiFi</MenuItem>
                            <MenuItem value="zigbee">Zigbee</MenuItem>
                            <MenuItem value="z-wave">Z-Wave</MenuItem>
                            <MenuItem value="lte-advanced">LTE-Advanced</MenuItem>
                            <MenuItem value="lora">LoRa</MenuItem>
                            <MenuItem value="nb-iot">NB-IoT</MenuItem>
                            <MenuItem value="sigfox">Sigfox</MenuItem>
                            <MenuItem value="nb-fi">NB-Fi</MenuItem>
                            <MenuItem value="http">HTTP</MenuItem>
                            <MenuItem value="https">HTTPS</MenuItem>
                            <MenuItem value="coap">CoAP</MenuItem>
                            <MenuItem value="mqtt">MQTT</MenuItem>
                            <MenuItem value="amqp">AMQP</MenuItem>
                            <MenuItem value="xmpp">XMPP</MenuItem>
                        </Select>
                        {errors.technology && <FormHelperText>{errors.technology}</FormHelperText>}
                    </FormControl>

                    <FormControl fullWidth margin="normal" error={!!errors.risk_level}>
                        <InputLabel id="risk-level-select-label">Risk Level</InputLabel>
                        <Select
                            labelId="risk-level-select-label"
                            id="risk-level-select"
                            name="risk_level"
                            value={formData.risk_level.toString()}
                            label="Risk Level"
                            onChange={handleChange}
                        >
                            <MenuItem value="1">Low Risk</MenuItem>
                            <MenuItem value="2">Medium Risk</MenuItem>
                            <MenuItem value="3">High Risk</MenuItem>
                        </Select>
                        {errors.risk_level && <FormHelperText>{errors.risk_level}</FormHelperText>}
                    </FormControl>

                    <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between" }}>
                        <Button variant="outlined" component={Link} href={`/projects/${projectId}`}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : null}
                        >
                            {loading ? "Updating..." : "Update Task"}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
}
