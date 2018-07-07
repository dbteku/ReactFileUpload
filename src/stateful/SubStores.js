import {createSubStore} from '@boostbank/stateful/lib/substore';

export default function SubStores(){
    createSubStore('nav', {}, 1);
}