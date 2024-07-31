import { Accordion } from "react-bootstrap";

import AccordionItem from "./AccordionItem";

const CustomAccordion = ({ children }) => {
  return (
    <Accordion>
      <Accordion.Item eventKey="0">
        <Accordion.Header>Added data</Accordion.Header>
        <Accordion.Body className="p-2">
          {children.map((item, index) => (
            <div key={index} className="mb-2">
              <AccordionItem item={item.props.children} />
            </div>
          ))}
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  );
};

export default CustomAccordion;
