import FlowDiagram, { type FlowDiagramProps } from "./FlowDiagram";
import styles from "./FlowDiagram.module.css";

export default function ArchitectureDiagram(props: FlowDiagramProps) {
  return (
    <div className={styles.panel}>
      <FlowDiagram {...props} />
    </div>
  );
}
