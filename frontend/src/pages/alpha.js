import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import Card from 'react-bootstrap/Card';
import CardDeck from 'react-bootstrap/CardDeck';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import alphaImg from '../assets/alpha.png';

export default (props) => {
  const { methodChunk, match } = props;
  const { alphas } = methodChunk;
  const { params: { name_id: alphaId } } = match;
  if (!methodChunk || !alphaId || !alphas) return null;
  const alpha = alphas.find(a => a.nameId === alphaId)
  if (!alpha) return null;
  
  let progressingActivity = []
  methodChunk.activitySpaces.forEach(activitySpace => {
    activitySpace.activities.forEach(activity => {
      activity.completionCriterions.alphas.forEach(progressed => {
        if (progressed.includes(alpha.nameId)) {
          progressingActivity.push(activity);
        }
      })
    })
  })

  let relatedPatterns = []
  methodChunk.patterns.forEach(pattern => {
    pattern.alphas.forEach(related => {
      if (related.includes(alpha.nameId)) {
        relatedPatterns.push(pattern);
      }
    })
  })

  return (
    <Styles>
      <div className='header'>
        <h4>{alpha.name}</h4>  
      </div>
      <div className='desc'>
        <p>{alpha.description}</p>
      </div>
      <Row className='content'>
        <Col sm={8} className='contain'>
          <div key={1} className='element'>
            <h5>Contains</h5>
            <CardDeck>
              {alpha.subalphaIds && alpha.subalphaIds.map(subalphaId => {
                const subalpha = alphas.find(a => a.nameId === subalphaId);
                return (
                  <Card key={subalphaId}>
                    <Card.Img variant="top" src={alphaImg} />
                    <Card.Title>{subalpha.name}</Card.Title>
                    <Card.Text>{subalpha.description}</Card.Text>
                  </Card>
                )
              })}
              {alpha.workProducts && alpha.workProducts.map(workProduct => (
                <Card key={workProduct.nameId}>
                  <Card.Img variant="top" src={alphaImg} />
                  <Card.Title>{workProduct.name}</Card.Title>
                  <Card.Text>{workProduct.description}</Card.Text>
                </Card>
              ))}
            </CardDeck>
          </div>
          <div key={2} className='element'>
            <h5>Progressed By</h5>
            <CardDeck>
              {progressingActivity && progressingActivity.map((activity,i) => (
                <Card key={i}>
                  <Card.Img variant="top" src={alphaImg} />
                  <Card.Title>{activity.name}</Card.Title>
                  <Card.Text>{activity.description}</Card.Text>
                </Card>
              ))}
            </CardDeck>
          </div>
          <div key={3} className='element'>
            <h5>Related Patterns</h5>
            <CardDeck>
              {relatedPatterns && relatedPatterns.map(pattern => (
                <Card key={pattern.nameId}>
                  <Card.Img variant="top" src={alphaImg} />
                  <Card.Title>{pattern.name}</Card.Title>
                  <Card.Text>{pattern.description}</Card.Text>
                </Card>
              ))}
            </CardDeck>
          </div>
        </Col>
        <Col sm={4} className='states'>
          {alpha.states && alpha.states.map(state => (
            <div key={state.nameId} className='state'>
              <h5>{state.name}</h5>
              <p>{state.description}</p>
              <ul style={{ listStyleType: 'circle' }}>
                {state.checklists.map((checklist, i) => (
                  <li key={i}>{checklist}</li>
                ))}
              </ul>
            </div>
          ))}
        </Col>
      </Row>
    </Styles>
  )
}

const Styles = styled.div`
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  width: 100%;
  & > .header {
    background-color: #cecece;
    text-align: center;
    padding: 10px;
  }
  & > .desc {
    border-top: 1px solid black;
    border-bottom: 1px solid black;
    min-height: 12%;
    padding: 10px;
  }
  & > .content {
    height: 65vh;
    overflow-y: scroll;
    & > .states {
      border-left: 1px solid black;
      padding-left: 30px;
      padding-top: 30px;
    }
    & > .contain {
      & > .element {
        padding: 20px 30px 0 30px;
        & .card-deck {
          padding: 0 50px;
          & .card {
            flex: 0 0 28%;
            height: 100%;
            margin: 4px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            text-align: center;
            font-size: 0.9em;
            & .card-img-top {
              width: 100px;
              height: 40%;
              margin: 5px auto;
            }
          }
        }
      }
    }
  }
`