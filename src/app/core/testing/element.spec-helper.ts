/* istanbul ignore file */

import { AnimationTriggerMetadata, trigger } from '@angular/animations';
import { HttpParams } from '@angular/common/http';
import { HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * A wrapper for httpTestingController.expectOne() that uses a matchFn overload for testing the base URL as well as the query parameters from the request.
 * No specific order is required for the query params. Use this method over httpTestingController.expectOne(url) if you have multiple query parameters that do not need a specific order.
 *
 * @param {HttpTestingController} httpTestingController httpTestingController under testing
 * @param {string} expectedFullUrl the full URL that is expected to match the actual URL
 * @param {string} expectedRequestMethod the expected request method
 * @returns {TestRequest} the test request
 */
export const expectHttpRequestToBeEquivalent = (
    httpTestingController: HttpTestingController,
    expectedFullUrl: string,
    expectedRequestMethod: string
): TestRequest => {
    const [expectedUrl, queryParamsString] = expectedFullUrl.split('?');
    let expectedQueryParams = new HttpParams();

    // Convert expected url query params to HttpParams
    queryParamsString.split('&').forEach((queryParam) => {
        const [key, value] = queryParam.split('=');
        expectedQueryParams = expectedQueryParams.append(key, value);
    });

    let req: TestRequest;
    // Test the URL
    try {
        req = httpTestingController.expectOne((req) => req.url === expectedUrl);
    } catch (e: any) {
        throw new Error(
            e.message.replace('Match by function: ', `Match by URL: ${expectedFullUrl}`) +
                '\n\nQuery params are allowed to be out of order. That is not the cause of this error.'
        );
    }

    // Test query params
    const numExpectedQueryParams = expectedQueryParams.keys().length;
    const numActualQueryParams = req.request.params.keys().length;
    if (numExpectedQueryParams !== numActualQueryParams) {
        throw new Error(
            `Error: Expected request to have ${numExpectedQueryParams} keys, but actually has ${numActualQueryParams}.`
        );
    }
    expectedQueryParams.keys().forEach((key) => {
        // Throw error if keys don't match
        if (!req.request.params.has(key)) {
            throw new Error(`Error: Expected request to have a '${key}' query param but does not.`);
        }
        const actualKeyValues = req.request.params.getAll(key) || [];
        const expectedKeyValues = expectedQueryParams.getAll(key) || [];
        // Throw error if number of values doesn't match
        if (expectedKeyValues.length !== actualKeyValues.length) {
            throw new Error(
                `Error: Expected request query param, '${key}', to contain ${expectedKeyValues.length} values, but actually has ${actualKeyValues.length}.`
            );
        }
        // Go through all values individually, as to not require a specific order
        expectedKeyValues.forEach((value) => {
            // Throw error if values of key don't match
            if (!actualKeyValues.includes(value)) {
                throw new Error(
                    `Error: Expected request query param, '${key}', to have value, '${value}', but does not. Actual value(s): '${actualKeyValues}'.`
                );
            }
        });
    });
    // Test request method
    expect(req.request.method).toBe(expectedRequestMethod);
    return req;
};

/**
 *
 * @param {string[]} triggerHandles Array of strings that represent the trigger handles of animations to stub
 * @returns {AnimationTriggerMetadata[]} Stubbed aniimations
 */
export const stubAnimations = (triggerHandles: string[]): AnimationTriggerMetadata[] => {
    return triggerHandles.map((handle) => trigger(handle, []));
};

/**
 * Spec helpers for working with the DOM
 */

/**
 * Returns a selector for the `data-testid` attribute with the given attribute value.
 *
 * @param {string} testId Test id set by `data-testid`
 * @returns {string} Id selector
 */
export const testIdSelector = (testId: string): string => {
    return `[data-testid="${testId}"]`;
};

/**
 * Finds a single element inside the Component by the given CSS selector.
 * Throws an error if no element was found.
 *
 * @param {ComponentFixture<any>} fixture Component fixture
 * @param {string} selector CSS selector
 * @returns {DebugElement} Debug element
 */
export const queryByCss = <T>(fixture: ComponentFixture<T>, selector: string): DebugElement => {
    // The return type of DebugElement#query() is declared as DebugElement,
    // but the actual return type is DebugElement | null.
    // See https://github.com/angular/angular/issues/22449.
    const debugElement = fixture.debugElement.query(By.css(selector));
    // Fail on null so the return type is always DebugElement.
    if (!debugElement) {
        throw new Error(`queryByCss: Element with ${selector} not found`);
    }
    return debugElement;
};

/**
 * Finds an element inside the Component by the given `data-testid` attribute.
 * Throws an error if no element was found.
 *
 * @param {ComponentFixture<any>} fixture Component fixture
 * @param {string} testId Test id set by `data-testid`
 * @returns {DebugElement} Debug element
 */
export const findEl = <T>(fixture: ComponentFixture<T>, testId: string): DebugElement => {
    return queryByCss<T>(fixture, testIdSelector(testId));
};

/**
 * Finds all elements with the given `data-testid` attribute.
 *
 * @param {ComponentFixture<any>} fixture Component fixture
 * @param {string} testId Test id set by `data-testid`
 * @returns {DebugElement[]} Debug elements
 */
export const findEls = <T>(fixture: ComponentFixture<T>, testId: string): DebugElement[] => {
    return fixture.debugElement.queryAll(By.css(testIdSelector(testId)));
};

/**
 * Gets the text content of an element with the given `data-testid` attribute.
 *
 * @param {ComponentFixture<any>} fixture Component fixture
 * @param {string} testId Test id set by `data-testid`
 * @returns {string} text content
 */
export const getText = <T>(fixture: ComponentFixture<T>, testId: string): string => {
    return findEl(fixture, testId).nativeElement.textContent;
};

/**
 * Expects that the element with the given `data-testid` attribute
 * has the given text content.
 *
 * @param {ComponentFixture<any>} fixture Component fixture
 * @param {string} testId Test id set by `data-testid`
 * @param {string} text Expected text
 */
export const expectText = <T>(fixture: ComponentFixture<T>, testId: string, text: string): void => {
    expect(getText(fixture, testId)).toBe(text);
};

/**
 * Expects that the element with the given `data-testid` attribute
 * has the given text content.
 *
 * @param {ComponentFixture<any>} fixture Component fixture
 * @param {string} testId Test id set by `data-testid`
 * @param {string} text Expected text
 */
export const expectContainedText = <T>(
    fixture: ComponentFixture<T>,
    testId: string,
    text: string
): void => {
    expect(getText(fixture, testId)).toContain(text);
};

/**
 * Expects that a component has the given text content.
 * Both the component text content and the expected text are trimmed for reliability.
 *
 * @param {ComponentFixture<any>} fixture Component fixture
 * @param {string} text Expected text
 */
export const expectContent = <T>(fixture: ComponentFixture<T>, text: string): void => {
    expect(fixture.nativeElement.textContent).toBe(text);
};

/**
 * Expects that an element is not part of the DOM.
 *
 * @param {ComponentFixture<any>} fixture Component fixture
 * @param {string} testId Test id set by `data-testid`
 */
export const expectNoEl = <T>(fixture: ComponentFixture<T>, testId: string): void => {
    expect(() => findEl(fixture, testId)).toThrowError(/Element with \[[^\]]*\] not found/);
};

/**
 * Expects that a component is not part of the DOM.
 *
 * @param {ComponentFixture<any>} fixture Component fixture
 * @param {string} selector Test id set by `data-testid`
 */
export const expectNoComp = <T>(fixture: ComponentFixture<T>, selector: string): void => {
    expect(() => findComponent(fixture, selector)).toThrowError(/Element with [^\]]* not found/);
};

/**
 * Dispatches a fake event (synthetic event) at the given element.
 *
 * @param {EventTarget} element Element that is the target of the event
 * @param {string} type Event name, e.g. `input`
 * @param {boolean} bubbles Whether the event bubbles up in the DOM tree
 */
export const dispatchFakeEvent = (element: EventTarget, type: string, bubbles = false): void => {
    // "cancelable: true" See: https://stackoverflow.com/a/49592762/11790081
    const event = new Event(type, { bubbles, cancelable: true });
    element.dispatchEvent(event);
};

/**
 * Enters text into a form field (`input`, `textarea` or `select` element).
 * Triggers appropriate events so Angular takes notice of the change.
 * If you listen for the `change` event on `input` or `textarea`,
 * you need to trigger it separately.
 *
 * @param {HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement} element Form field
 * @param {string} value Form field value
 */
export const setFieldElementValue = (
    element: HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
    value: string
): void => {
    element.value = value;
    // Dispatch an `input` or `change` fake event
    // so Angular form bindings take notice of the change.
    const isSelect = element instanceof HTMLSelectElement;
    dispatchFakeEvent(element, isSelect ? 'change' : 'input', isSelect ? false : true);
};

/**
 * Sets the value of a form field with the given `data-testid` attribute.
 *
 * @param {ComponentFixture<any>} fixture Component fixture
 * @param {string} testId Test id set by `data-testid`
 * @param {string} value Form field value
 */
export const setFieldValue = <T>(
    fixture: ComponentFixture<T>,
    testId: string,
    value: string
): void => {
    setFieldElementValue(findEl(fixture, testId).nativeElement, value);
};

/**
 * Checks or unchecks a checkbox or radio button.
 * Triggers appropriate events so Angular takes notice of the change.
 *
 * @param {ComponentFixture<any>} fixture Component fixture
 * @param {string | DebugElement | HTMLElement} element Element to check
 * @param {BooleanConstructor} checked Whether the checkbox or radio should be checked
 * @param {boolean} isComponent Whether the elemenet is a component
 */
export const checkField = <T>(
    fixture: ComponentFixture<T>,
    element: string | DebugElement | HTMLElement,
    checked?: boolean,
    isComponent = false
): void => {
    if (typeof element === 'string') {
        element = (isComponent ? findComponent : findEl)(fixture, element);
    }
    let { nativeElement } = element as DebugElement;
    if (!nativeElement) {
        nativeElement = element;
    }
    nativeElement.checked = checked === undefined ? !nativeElement.checked : checked;
    // Dispatch a `change` fake event so Angular form bindings take notice of the change.
    dispatchFakeEvent(nativeElement, 'change');
};

/**
 * Makes a fake click event that provides the most important properties.
 * Sets the button to left.
 * The event can be passed to DebugElement#triggerEventHandler.
 *
 * @param {EventTarget} target Element that is the target of the click event
 * @returns {Partial<MouseEvent>} Click event
 */
export const makeClickEvent = (target: EventTarget): Partial<MouseEvent> => {
    return {
        preventDefault: () => {
            return null;
        },
        stopPropagation: () => {
            return null;
        },
        stopImmediatePropagation: () => {
            return null;
        },
        type: 'click',
        target,
        currentTarget: target,
        bubbles: true,
        cancelable: true,
        button: 0,
    };
};

/**
 * Emulates a left click on the element with the given `data-testid` attribute.
 *
 * @param {ComponentFixture<any>} fixture Component fixture
 * @param {string | DebugElement} element Test id set by `data-testid` or DebugElement
 * @param {boolean} isComponent Whether the element is a component
 */
export const click = <T>(
    fixture: ComponentFixture<T>,
    element: string | DebugElement,
    isComponent = false
): void => {
    if (typeof element === 'string') {
        element = (isComponent ? findComponent : findEl)(fixture, element);
    }
    const event = makeClickEvent(element.nativeElement);
    element.triggerEventHandler('click', event);
};

/**
 * Finds a nested Component by its selector, e.g. `app-example`.
 * Throws an error if no element was found.
 * Use this only for shallow component testing.
 * When finding other elements, use `findEl` / `findEls` and `data-testid` attributes.
 *
 * @param {ComponentFixture<any>} fixture Fixture of the parent Component
 * @param {string} selector Element selector, e.g. `app-example`
 * @returns {DebugElement} Debug Element
 */
export const findComponent = <T>(fixture: ComponentFixture<T>, selector: string): DebugElement => {
    return queryByCss(fixture, selector);
};

/**
 * Finds all nested Components by its selector, e.g. `app-example`.
 *
 * @param {ComponentFixture<any>} fixture Fixture of the parent component
 * @param {string} selector Element selector, e.g. `app-example`
 * @returns {DebugElement} Debug element
 */
export const findComponents = <T>(
    fixture: ComponentFixture<T>,
    selector: string
): DebugElement[] => {
    return fixture.debugElement.queryAll(By.css(selector));
};
