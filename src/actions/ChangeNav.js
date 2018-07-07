import {subModify, lookup} from '@boostbank/stateful/lib/substore';

export default function ChangeNav(links){
    if(Array.isArray(links)){
        subModify(lookup().nav, store=>{
            store.links = links;
            return store;
        });
    }
}