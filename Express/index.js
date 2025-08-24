import express from "express";
const app = express();
const port = 5432;

app.use(express.json());

// Middleware to measure response time
app.use((req, res, next) => {
  req.startTime = process.hrtime.bigint();
  next();
});

app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.get("/benchmark", (req, res) => {
  const endTime = process.hrtime.bigint();
  const responseTimeMs = Number(endTime - req.startTime) / 1000000; // Convert nanoseconds to milliseconds

  res.json({
    framework: "Express",
    responseTime: `${responseTimeMs.toFixed(3)}ms`,
    timestamp: new Date().toISOString(),
    message: "Response time measurement",
  });
});

app.get("/benchmark-average", (req, res) => {
  const times = [];
  const iterations = 100000;

  // Run 10 iterations to measure average response time
  for (let i = 0; i < iterations; i++) {
    const startTime = process.hrtime.bigint();

    // Simulate some processing work
    const data = {
      framework: "Express",
      iteration: i + 1,
      timestamp: new Date().toISOString(),
      message: "Average response time measurement",
    };

    // Add some computational work to make timing more measurable
    for (let j = 0; j < 1000; j++) {
      Math.random() * Math.random();
    }

    const endTime = process.hrtime.bigint();
    const responseTimeMs = Number(endTime - startTime) / 1000000;
    times.push(responseTimeMs);
  }

  const averageTime = times.reduce((sum, time) => sum + time, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);

  res.json({
    framework: "Express",
    iterations: iterations,
    averageResponseTime: `${averageTime.toFixed(3)}ms`,
    minResponseTime: `${minTime.toFixed(3)}ms`,
    maxResponseTime: `${maxTime.toFixed(3)}ms`,
    allTimes: times.map((time) => `${time.toFixed(3)}ms`),
    timestamp: new Date().toISOString(),
    message: "Average response time over 10 iterations",
  });
});

app.listen(port, () => {
  console.log("Server is running on port 5432");
});
