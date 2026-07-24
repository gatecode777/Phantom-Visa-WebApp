import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 50 },  // Ramp up to 50 users
    { duration: "1m", target: 300 },   // 3x projected peak load
    { duration: "30s", target: 0 }     // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<300"], // 95% of requests must complete under 300ms
    http_req_failed: ["rate<0.01"]     // Error rate must be under 1%
  }
};

export default function () {
  const url = "http://localhost:3000/api/v1/applications";
  const params = {
    headers: {
      "Content-Type": "application/json",
      "X-API-Version": "v1.0.0"
    }
  };

  const res = http.get(url, params);
  check(res, {
    "status is 200": (r) => r.status === 200,
    "has rate limit header": (r) => r.headers["X-Ratelimit-Limit"] !== undefined
  });

  sleep(1);
}
