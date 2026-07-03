import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  // El proyecto entregable es un sitio 100% estático bajo /artscope/
  // (HTML + CSS + JS + JSON). Compatible con GitHub Pages.
  useEffect(() => {
    window.location.replace("/artscope/index.html");
  }, []);

  return (
    <div style={{ minHeight: "100dvh", display: "grid", placeItems: "center", background: "#0F1117", color: "#F5F7FA", fontFamily: "system-ui" }}>
      <p>Cargando Art Scope… <a href="/artscope/" style={{ color: "#00B8FF" }}>entrar</a></p>
    </div>
  );
}
