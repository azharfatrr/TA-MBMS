import React from 'react';
import { Link } from 'react-router-dom';

import styles from './competency.module.scss';

export default (props) => {
  const { methodChunk, match } = props;
  const { competencies } = methodChunk;
  const { params: { name_id: competencyId } } = match;
  if (!methodChunk || !competencyId || !competencies) return null;
  
  let competency = competencies.find(c => c.nameId === competencyId)
  if (!competency) return null;

  return (
    <div className={styles['container']}>
      <div className={styles['header']}>
        <h4>{competency.name}</h4>  
      </div>
      <div className={styles['desc']}>
        <p>{competency.description}</p>
      </div>
      <div className={styles['content']}>
        <h5>Levels</h5>
        <table>
          {competency.levels.map((level, i) => (
              <tr>
                <td>{`Level ${i}`}</td>
                <td>{level.name}</td>
                <td>{level.description}</td>
              </tr>
          ))}
        </table>
      </div>
    </div>
  )
}