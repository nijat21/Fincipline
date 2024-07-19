import { useRef } from "react";
import { useInView } from "framer-motion";

function SectionRight({ children }) {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });

    return (
        <section ref={ref}>
            <span
                style={{
                    display: 'inline-block',
                    transform: isInView ? "none" : "translateX(1000px)",
                    opacity: isInView ? 1 : 0,
                    transition: "all 0.9s cubic-bezier(0.17, 0.55, 0.55, 1) 0.3s"
                }}
            >
                {children}
            </span>
        </section>
    );
}

export default SectionRight;
