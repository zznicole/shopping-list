import React, { useState } from 'react';
import Editable from './Editable';
import {Container, Card, Typography, IconButton, CardContent} from '@material-ui/core';
import { Check, Delete } from '@material-ui/icons';

export default function TobuyItem({
  title,
  subtitle,
  checkTobuy,
  id,
  isCompleted,
  deleteTobuy,
}) {
  const [newTitle, setNewTitle ] = useState("");
  const markCompleted = () => checkTobuy(id);
  const tobuyItemStyle = isCompleted
    ? { textDecoration: 'line-through', minWidth: 0, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
    : { textDecoration: 'none', minWidth: 0, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'  };
  const delTobuy = () => deleteTobuy(id);
  return (
    <div>
      <Container>
        <Card variant="contained" style={{ marginTop: 5, display: 'flex', alignContent: 'space-between', alignItems: 'stretch' }}>
          <IconButton onClick={markCompleted}>
            <Check style={{ color: 'green' }} />
          </IconButton>
          <CardContent style={{flex: 1, minWidth: 0}}>
            <Editable text={newTitle} placeholder={title} type="input" style={tobuyItemStyle}> 
              <input type="text" name="newTitle" placeholder={title} value={newTitle} onChange={e=> setNewTitle(e.target.value)} />
            </Editable>
            {/* <Typography variant="h5" component="h2" style={tobuyItemStyle}>
              {title}
            </Typography>
            <Typography variant="subtitle1" style={tobuyItemStyle} color="textSecondary">
              {subtitle}
            </Typography> */}
          </CardContent>
          <IconButton style={{ float: 'right' }} onClick={delTobuy}>
            <Delete style={{ color: 'red' }} />
          </IconButton>
        </Card>
      </Container>
    </div>
  );
}
