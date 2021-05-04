import React, { useState } from 'react';
import Editable from './Editable';
import {Container, Card, Typography, IconButton, CardContent} from '@material-ui/core';
import { Check, Delete } from '@material-ui/icons';
import { Input } from '@material-ui/core';

export default function TobuyItem({
  title,
  subtitle,
  itemType,
  checkTobuy,
  id,
  isCompleted,
  checked,
  deleteTobuy,
  editTobuy,
}) {
  const [newTitle, setNewTitle ] = useState(title);
  const markCompleted = () => checkTobuy(id);
const tobuyItemStyle = isCompleted
  ? { textDecoration: 'line-through', minWidth: 0, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
  : { textDecoration: 'none', minWidth: 0, flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'  };
  const tobuyCheckboxColor = checked ? 'green' : 'lightgrey';
  const delTobuy = () => deleteTobuy(id);
  return (
    <div>
      <Container>
        <Card variant="contained" style={{ marginTop: 5, display: 'flex', alignContent: 'space-between', alignItems: 'stretch' }}>
          {itemType === "header" ?
            <CardContent style={{flex: 1, minWidth: 0}}>
              <Typography  variant="h4" text={newTitle} type="input" style={tobuyItemStyle}>
                {title}
              </Typography>
              {/*<Typography variant="subtitle1" style={tobuyItemStyle} color="textSecondary">*/}
              {/*  {subtitle}*/}
              {/*</Typography>*/}
            </CardContent>
            :
            <>
              <IconButton onClick={markCompleted}>
                <Check style={{ color: tobuyCheckboxColor }} />
              </IconButton>
              <CardContent style={{flex: 1, minWidth: 0}}>
              {editTobuy === undefined ?
                  <Typography  variant="body1" text={newTitle} type="input" style={tobuyItemStyle}>
                    {newTitle}
                  </Typography>
                :
                <Editable variant="h5" text={newTitle} placeholder={newTitle} type="input" style={tobuyItemStyle}>
                  <Input variant="h5" type="text" name="newTitle" placeholder={newTitle} value={newTitle} style={tobuyItemStyle} fullWidth={true}  onChange={e=> {setNewTitle(e.target.value); editTobuy(id,e.target.value)} } />
                </Editable>
              }
                {/*<Typography variant="subtitle1" style={tobuyItemStyle} color="textSecondary">*/}
                {/*{subtitle}*/}
                {/*</Typography>*/}
              </CardContent>
                {deleteTobuy === undefined ?  <></>:
              <IconButton style={{ float: 'right' }} onClick={delTobuy}>
                <Delete style={{ color: 'red' }} />
              </IconButton>
                }
            </>
          }
        </Card>
      </Container>
    </div>
  );
}
