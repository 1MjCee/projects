import { useEffect } from "react";

const TawkToWidget = () => {
  useEffect(() => {
    // Check if the Tawk.to script is already added
    if (!document.getElementById("tawk-to-script")) {
      const script = document.createElement("script");
      script.id = "tawk-to-script";
      script.async = true;
      script.src = "https://embed.tawk.to/673df87b2480f5b4f5a117dc/1id515946";
      script.charset = "UTF-8";
      script.setAttribute("crossorigin", "*");

      const firstScript = document.getElementsByTagName("script")[0];
      firstScript.parentNode.insertBefore(script, firstScript);

      // Initialize Tawk.to API
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();
    }

    return () => {
      const script = document.getElementById("tawk-to-script");
      if (script) {
        script.remove();
      }
    };
  }, []);

  return null;
};

export default TawkToWidget;
