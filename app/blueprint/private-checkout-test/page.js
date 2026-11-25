import PageFrame from '../../components/PageFrame';
import CheckoutButton from '../../components/CheckoutButton';

export const metadata={title:'TEACH checkout test',robots:{index:false,follow:false}};

export default function Page(){
 return <PageFrame eyebrow="TEACH" title="Private checkout test">
  <p>This one-use test grants the complete Blueprint and GAP K–2 to the designated TEACH test account. The total due is $0.</p>
  <CheckoutButton productKey="gap-bundle-k2" returnPath="/blueprint/private-checkout-test" buttonLabel="Open the $0 test checkout"/>
 </PageFrame>;
}
