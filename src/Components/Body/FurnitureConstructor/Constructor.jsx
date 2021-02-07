import React, { Component } from 'react';
import { DropdownButton, Dropdown, Accordion, Card, Button } from "react-bootstrap";
import axios from "axios";
import ChairTemplate from './ConstructionTemplates/Chair';
import DraggableComponent from './DraggableComponent';

class Constructor extends Component {

    constructor(props) {
        super(props);

        this.state = {
            components_by_category: []
        };
    }

    componentWillMount = () => {
        this.getComponentsByCategoryInfo();
    }

    getComponentsByCategoryInfo = () => {
        axios(
            {
                method: 'get',
                url: `http://127.0.0.1:8000/api/components_by_type/`
            }
        )
            .then(
                res => {
                    this.setState({
                        components_by_category: res.data
                    });
                }
            )
    }

    showComponentsByType = () => {
        let componentMenuMarkup = [];
        for (const [key, value] of Object.entries(this.state.components_by_category)) {
            componentMenuMarkup.push(
                <Card>
                    <Card.Header>
                        <Accordion.Toggle as={Button} variant="link" eventKey={key}>
                            {key}
                        </Accordion.Toggle>
                    </Card.Header>
                    {
                        value.map(k =>
                            <DraggableComponent eventKey={key} image={k[1]} name={k[0]} />
                        )
                    }
                </Card>
            );
        }
        return componentMenuMarkup;
    }

    render() {
        return (
            <div>
                <div>
                    Проектування конструкції меблів
                </div>
                <div>
                    <Accordion defaultActiveKey="0">
                        {
                            this.showComponentsByType()
                        }
                    </Accordion>
                </div>
                <div>
                    <div>
                        <div>
                            Оберіть тип меблів для складання:
                        </div>
                        <div>
                            <DropdownButton id="dropdown-basic-button"
                                            title="Доступні типи меблів">

                            </DropdownButton>
                        </div>
                    </div>
                    <div>
                        <ChairTemplate />
                    </div>
                </div>
            </div>
        );
    }
}

export default Constructor;