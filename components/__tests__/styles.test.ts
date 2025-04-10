import { categorystyles } from '@/styles/categorystyles';
import { drawerStyles } from '@/styles/drawerstyles';
import { loginstyles } from '@/styles/loginstyles';
import { moviestyles } from '@/styles/mainmovestyles';
import { detailstyles } from '@/styles/moviedetailsstyles';
import { profilestyles } from '@/styles/profileinfostyles';
import { recstyles } from '@/styles/reccomendationstyles';
import { savedstyles } from '@/styles/savedmoviestyles';

describe('Stylesheets', () => {
  const styleSuites = [
    { name: 'Category Styles', styles: categorystyles },
    { name: 'Drawer Styles', styles: drawerStyles },
    { name: 'Login Styles', styles: loginstyles },
    { name: 'Movie Styles', styles: moviestyles },
    { name: 'Detail Styles', styles: detailstyles },
    { name: 'Profile Styles', styles: profilestyles },
    { name: 'Rec Styles', styles: recstyles },
    { name: 'Saved Styles', styles: savedstyles },
  ];

  styleSuites.forEach(({ name, styles }) => {
    describe(name, () => {
      it('should be defined', () => {
        expect(styles).toBeDefined();
      });

      it('should contain at least one style rule', () => {
        expect(Object.keys(styles).length).toBeGreaterThan(0);
      });

      it('should have only objects as style values', () => {
        Object.keys(styles).forEach((key) => {
          const typedKey = key as keyof typeof styles;
          expect(typeof styles[typedKey]).toBe('number');
        });
      });
});
  });
});
