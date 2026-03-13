import { headerStyles } from './navigation-header.styles';
import { Button } from '@components/controls/button';
import { Icon } from '@components/primitives/icon';
import { useNavigationContext } from '../navigation.context';

// TODO navHeader when collapse and hover show tooltip

export function NavigationHeader() {
  const { isExpanded, toggleExpanded } = useNavigationContext();
  return (
    <Button className={headerStyles.wrapper} variant="ghost" onPress={toggleExpanded}>
      <Icon name="app" className={headerStyles.app} />
      <Icon
        name={isExpanded ? 'collapse' : 'expand'}
        aria-label={isExpanded ? 'expand' : 'collapse'}
        className={headerStyles.expand}
      />
    </Button>
  );
}
