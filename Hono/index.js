import { Hono } from "hono";
import { serve } from "@hono/node-server";

const app = new Hono();

app.get("/", (c) => c.text("Hello Hono! 🚀"));
app.get("/json", (c) => c.json({ message: "Hello from JSON!" }));

app.get("/benchmark", (c) => {
  const startTime = process.hrtime.bigint();

  // Simulate some processing time to get a measurable response
  const data = {
    framework: "Hono",
    timestamp: new Date().toISOString(),
    message: "Response time measurement",
  };

  const endTime = process.hrtime.bigint();
  const responseTimeMs = Number(endTime - startTime) / 1000000; // Convert nanoseconds to milliseconds

  data.responseTime = `${responseTimeMs.toFixed(3)}ms`;

  return c.json(data);
});

app.get("/benchmark-average", (c) => {
  const times = [];
  const iterations = 100000;

  // Run 10 iterations to measure average response time
  for (let i = 0; i < iterations; i++) {
    const startTime = process.hrtime.bigint();

    // Simulate some processing work
    const data = {
      framework: "Hono",
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

  return c.json({
    framework: "Hono",
    iterations: iterations,
    averageResponseTime: `${averageTime.toFixed(3)}ms`,
    minResponseTime: `${minTime.toFixed(3)}ms`,
    maxResponseTime: `${maxTime.toFixed(3)}ms`,
    allTimes: times.map((time) => `${time.toFixed(3)}ms`),
    timestamp: new Date().toISOString(),
    message: "Average response time over 10 iterations",
  });
});

app.post("/data", async (c) => {
  const body = await c.req.json();
  return c.json({ received: body });
});

// ✅ Correct usage of serve
serve(
  {
    fetch: app.fetch,
    port: 3000, // port number
  },
  (info) => {
    console.log(`🚀 Server is running at http://localhost:${info.port}`);
  }
);
