import { getTD, getTR, getTable } from './html';

describe('HTML helper functions', () => {
    test('getTD wraps input in td tags', () => {
        const input = 'test';
        const expectedOutput = '<td>test</td>';
        expect(getTD(input)).toBe(expectedOutput);
    });

    test('getTR wraps input in tr tags', () => {
        const input = 'test';
        const expectedOutput = '<tr>test</tr>\n';
        expect(getTR(input)).toBe(expectedOutput);
    });

    test('getTable wraps input in table tags', () => {
        const input = 'test';
        const expectedOutput = '<table>test</table>';
        expect(getTable(input)).toBe(expectedOutput);
    });
});