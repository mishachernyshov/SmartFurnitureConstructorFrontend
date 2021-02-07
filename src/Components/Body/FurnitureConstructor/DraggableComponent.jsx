import React, { useState, useCallback, useMemo } from 'react';
import {Accordion, Card} from "react-bootstrap";
import { useDrag } from 'react-dnd';

const DraggableComponent = (props) => {
    return (
        <Accordion.Collapse eventKey={props.eventKey}>
            <Card.Body>
                <div>
                    <img src={props.image} />
                </div>
                <div>
                    {props.name}
                </div>
            </Card.Body>
        </Accordion.Collapse>
    );
}

export default DraggableComponent;