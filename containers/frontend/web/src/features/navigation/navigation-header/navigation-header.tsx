import { headerStyles } from './navigation-header.styles';
import { Button } from '@components/controls/button';
import { Icon } from '@components/primitives/icon';
import { useNavigationContext } from '../navigation.context';

export function NavigationHeader() {
  const { isExpanded, toggleExpanded, closeNavigation } = useNavigationContext();

  const handlePress = () => {
    if (isExpanded) {
      closeNavigation();
      return;
    }

    toggleExpanded();
  };

  return (
    <Button className={headerStyles.wrapper} variant="ghost" onPress={handlePress}>
      <Icon name="app" className={headerStyles.app} size={20} />
      <Icon
        name={isExpanded ? 'collapse' : 'expand'}
        aria-label={isExpanded ? 'collapse navigation' : 'expand navigation'}
        className={headerStyles.expand}
        size={20}
      />
    </Button>
  );
}
