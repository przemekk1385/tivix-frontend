let apiHost = "";

if (process.env.NODE_ENV === "production") {
  apiHost = "http://yourdomain.com/api/";
} else {
  apiHost = "http://127.0.0.1:8000/";
}

export default apiHost;
