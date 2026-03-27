import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { vp } from '../../styles/scale';
import Nui from '../../Nui';

interface InternalMenuOption {
  title: string;
  description?: string;
  menu?: string;
  event?: string;
  args?: any;
}

interface InternalMenuData {
  id: string;
  title: string;
  menu?: string;
  options: InternalMenuOption[];
}

interface MenuPayload {
  startMenuId: string;
  menus: Record<string, InternalMenuData>;
}

type DropdownType = 'import' | 'save' | 'generate' | 'submenu' | 'store_create' | 'store_edit' | 'store_delete';

interface DropdownState {
  key: string;
  type: DropdownType;
  name: string;
  code: string;
  loading?: boolean;
  options?: InternalMenuOption[];
  id?: number;
  storeType?: string;
  rotation?: number;
  sizeX?: number;
  sizeY?: number;
  sizeZ?: number;
  job?: string;
  gang?: string;
  showBlip?: boolean;
  coords?: { x: number; y: number; z: number };
}

interface NestedDropdownState {
  key: string;
  type: Exclude<DropdownType, 'submenu'>;
  name: string;
  code: string;
  loading?: boolean;
  id?: number;
  storeType?: string;
  rotation?: number;
  sizeX?: number;
  sizeY?: number;
  sizeZ?: number;
  job?: string;
  gang?: string;
  showBlip?: boolean;
  coords?: { x: number; y: number; z: number };
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: ${vp(16)} ${vp(16)} ${vp(16)} ${vp(16)};
  background: transparent;
`;

const Card = styled.div`
  width: min(${vp(420)}, calc(100vw - ${vp(32)}));
  border-radius: ${vp(16)};
  padding: ${vp(14)} ${vp(14)} ${vp(12)};
  background:
    linear-gradient(145deg, rgba(255, 166, 113, 0.2), rgba(255, 122, 182, 0.2) 50%, rgba(120, 144, 255, 0.14) 100%),
    rgba(24, 31, 46, 0.84);
  border: 1px solid rgba(255, 223, 232, 0.62);
  box-shadow: 0 ${vp(14)} ${vp(40)} rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.3);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${vp(12)};
`;

const Title = styled.h2`
  margin: 0;
  font-size: ${vp(18)};
  font-weight: 700;
  color: #ffffff;
  font-family: 'Grift', 'Nexa-Book', sans-serif;
`;

const BackButton = styled.button`
  border: 1px solid rgba(255, 255, 255, 0.35);
  background: rgba(255, 255, 255, 0.1);
  border-radius: ${vp(8)};
  padding: ${vp(6)} ${vp(12)};
  color: #fff;
  font-size: ${vp(12)};
  cursor: pointer;
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${vp(6)};
  max-height: min(${vp(460)}, calc(100vh - ${vp(110)}));
  overflow-y: auto;
`;

const ItemCard = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.24);
  background: rgba(255, 255, 255, 0.08);
  border-radius: ${vp(8)};
  transition: transform 120ms ease, background 180ms ease, border-color 180ms ease;

  &:hover {
    transform: translateY(${vp(-1)});
    background: rgba(255, 255, 255, 0.13);
    border-color: rgba(255, 255, 255, 0.42);
  }
`;

const ItemButton = styled.button`
  width: 100%;
  text-align: left;
  border: none;
  background: transparent;
  padding: ${vp(9)} ${vp(11)};
  color: #fff;
  cursor: pointer;
`;

const ItemTitle = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: ${vp(14)};
  font-weight: 700;
  margin-bottom: ${vp(2)};
`;

const ItemDescription = styled.div`
  font-size: ${vp(12)};
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
`;

const Footer = styled.div`
  margin-top: ${vp(10)};
  font-size: ${vp(11)};
  color: rgba(255, 255, 255, 0.75);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${vp(6)};
  margin-bottom: ${vp(10)};
`;

const FormLabel = styled.label`
  font-size: ${vp(12)};
  color: rgba(255, 255, 255, 0.92);
  font-weight: 600;
`;

const FormInput = styled.input`
  height: ${vp(36)};
  border-radius: ${vp(8)};
  border: 1px solid rgba(255, 255, 255, 0.26);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: ${vp(13)};
  padding: 0 ${vp(10)};
  outline: none;

  &:focus {
    border-color: rgba(255, 255, 255, 0.52);
  }
`;

const FormSelect = styled.select`
  height: ${vp(36)};
  border-radius: ${vp(8)};
  border: 1px solid rgba(255, 255, 255, 0.26);
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
  font-size: ${vp(13)};
  padding: 0 ${vp(10)};
  outline: none;

  &:focus {
    border-color: rgba(255, 255, 255, 0.52);
  }
`;

const FormActions = styled.div`
  display: flex;
  gap: ${vp(8)};
  margin-top: ${vp(8)};

  button {
    flex: 1;
    height: ${vp(34)};
    border-radius: ${vp(8)};
    border: 1px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.12);
    color: #fff;
    font-size: ${vp(12)};
    font-weight: 600;
    cursor: pointer;
  }

  button:last-child {
    background: linear-gradient(140deg, rgba(255, 188, 72, 0.95), rgba(255, 118, 198, 0.9));
    border-color: rgba(255, 233, 169, 0.72);
    color: rgba(42, 22, 74, 0.98);
  }
`;

const InlinePanel = styled.div`
  padding: ${vp(10)};
  border-top: 1px solid rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.05);
`;

const InternalMenu = () => {
  const [visible, setVisible] = useState(false);
  const [menus, setMenus] = useState<Record<string, InternalMenuData>>({});
  const [history, setHistory] = useState<string[]>([]);
  const [dropdown, setDropdown] = useState<DropdownState | null>(null);
  const [nestedDropdown, setNestedDropdown] = useState<NestedDropdownState | null>(null);

  const currentMenuId = history[history.length - 1];
  const currentMenu = useMemo(() => menus[currentMenuId], [menus, currentMenuId]);

  const closeMenu = () => {
    setVisible(false);
    setMenus({});
    setHistory([]);
    setDropdown(null);
    setNestedDropdown(null);
    Nui.post('internal_menu_close');
  };

  const onSelectOption = async (option: InternalMenuOption, optionKey: string) => {
    if (option.menu) {
      const submenu = option.menu ? menus[option.menu] : null;
      if (submenu?.options?.length) {
        setDropdown(prev =>
          prev?.key === optionKey
            ? null
            : {
                key: optionKey,
                type: 'submenu',
                name: '',
                code: '',
                options: submenu.options,
              },
        );
        setNestedDropdown(null);
      } else {
        setHistory(prev => [...prev, option.menu as string]);
        setDropdown(null);
        setNestedDropdown(null);
      }
      return;
    }

    if (option.event === 'illenium-appearance:client:importOutfitCode') {
      setDropdown(prev =>
        prev?.key === optionKey ? null : { key: optionKey, type: 'import', name: 'Imported Outfit', code: '' },
      );
      setNestedDropdown(null);
      return;
    }

    if (option.event === 'illenium-appearance:client:saveOutfit') {
      setDropdown(prev => (prev?.key === optionKey ? null : { key: optionKey, type: 'save', name: '', code: '' }));
      setNestedDropdown(null);
      return;
    }

    if (option.event === 'illenium-appearance:client:generateOutfitCode') {
      setDropdown({ key: optionKey, type: 'generate', name: '', code: '', loading: true });
      setNestedDropdown(null);
      const result = await Nui.post('internal_menu_generate_code', { id: option.args });
      if (result?.success && result?.code) {
        setDropdown({ key: optionKey, type: 'generate', name: '', code: result.code, loading: false });
      } else {
        setDropdown(null);
      }
      return;
    }

    if (option.event === 'illenium-appearance:client:storeAdminCreate') {
      const pos = await Nui.post('internal_menu_get_player_transform', {});
      if (!pos?.success || !pos?.coords) return;
      setDropdown({
        key: optionKey,
        type: 'store_create',
        name: '',
        code: '',
        storeType: 'clothing',
        rotation: Number(pos.heading || 0),
        sizeX: 4,
        sizeY: 4,
        sizeZ: 4,
        job: '',
        gang: '',
        showBlip: true,
        coords: pos.coords,
      });
      setNestedDropdown(null);
      return;
    }

    if (option.event === 'illenium-appearance:client:storeAdminEdit') {
      const store = option.args || {};
      const coords = store.coords || {};
      const size = store.size || {};
      setDropdown({
        key: optionKey,
        type: 'store_edit',
        id: store.id,
        name: '',
        code: '',
        storeType: store.type || 'clothing',
        rotation: Number(store.rotation || coords.w || 0),
        sizeX: Number(size.x || 4),
        sizeY: Number(size.y || 4),
        sizeZ: Number(size.z || 4),
        job: store.job || '',
        gang: store.gang || '',
        showBlip: store.showBlip !== false,
        coords: { x: Number(coords.x || 0), y: Number(coords.y || 0), z: Number(coords.z || 0) },
      });
      setNestedDropdown(null);
      return;
    }

    if (option.event === 'illenium-appearance:client:storeAdminDelete') {
      const storeId = typeof option.args === 'number' ? option.args : Number(option.args || 0);
      if (!storeId) return;
      setDropdown({
        key: optionKey,
        type: 'store_delete',
        id: storeId,
        name: '',
        code: '',
      });
      setNestedDropdown(null);
      return;
    }

    if (option.event) {
      setVisible(false);
      Nui.post('internal_menu_select', { event: option.event, args: option.args });
    }
  };

  const onSelectSubOption = async (option: InternalMenuOption, optionKey: string) => {
    if (option.event === 'illenium-appearance:client:generateOutfitCode') {
      setNestedDropdown({ key: optionKey, type: 'generate', name: '', code: '', loading: true });
      const result = await Nui.post('internal_menu_generate_code', { id: option.args });
      if (result?.success && result?.code) {
        setNestedDropdown({ key: optionKey, type: 'generate', name: '', code: result.code, loading: false });
      } else {
        setNestedDropdown(null);
      }
      return;
    }

    if (option.event === 'illenium-appearance:client:importOutfitCode') {
      setNestedDropdown(prev =>
        prev?.key === optionKey ? null : { key: optionKey, type: 'import', name: 'Imported Outfit', code: '' },
      );
      return;
    }

    if (option.event === 'illenium-appearance:client:saveOutfit') {
      setNestedDropdown(prev => (prev?.key === optionKey ? null : { key: optionKey, type: 'save', name: '', code: '' }));
      return;
    }

    if (option.event === 'illenium-appearance:client:storeAdminCreate') {
      const pos = await Nui.post('internal_menu_get_player_transform', {});
      if (!pos?.success || !pos?.coords) return;
      setNestedDropdown({
        key: optionKey,
        type: 'store_create',
        name: '',
        code: '',
        storeType: 'clothing',
        rotation: Number(pos.heading || 0),
        sizeX: 4,
        sizeY: 4,
        sizeZ: 4,
        job: '',
        gang: '',
        showBlip: true,
        coords: pos.coords,
      });
      return;
    }

    if (option.event === 'illenium-appearance:client:storeAdminEdit') {
      const store = option.args || {};
      const coords = store.coords || {};
      const size = store.size || {};
      setNestedDropdown({
        key: optionKey,
        type: 'store_edit',
        id: store.id,
        name: '',
        code: '',
        storeType: store.type || 'clothing',
        rotation: Number(store.rotation || coords.w || 0),
        sizeX: Number(size.x || 4),
        sizeY: Number(size.y || 4),
        sizeZ: Number(size.z || 4),
        job: store.job || '',
        gang: store.gang || '',
        showBlip: store.showBlip !== false,
        coords: { x: Number(coords.x || 0), y: Number(coords.y || 0), z: Number(coords.z || 0) },
      });
      return;
    }

    if (option.event === 'illenium-appearance:client:storeAdminDelete') {
      const storeId = typeof option.args === 'number' ? option.args : Number(option.args || 0);
      if (!storeId) return;
      setNestedDropdown({
        key: optionKey,
        type: 'store_delete',
        id: storeId,
        name: '',
        code: '',
      });
      return;
    }

    if (option.event) {
      setVisible(false);
      Nui.post('internal_menu_select', { event: option.event, args: option.args });
    }
  };

  useEffect(() => {
    Nui.onEvent('internal_menu_open', (payload: MenuPayload) => {
      setMenus(payload.menus || {});
      setHistory(payload.startMenuId ? [payload.startMenuId] : []);
      setDropdown(null);
      setNestedDropdown(null);
      setVisible(true);
    });

    Nui.onEvent('internal_menu_close', () => {
      setVisible(false);
      setMenus({});
      setHistory([]);
      setDropdown(null);
      setNestedDropdown(null);
    });
  }, []);

  useEffect(() => {
    if (!visible) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        if (history.length > 1) {
          setHistory(prev => prev.slice(0, -1));
        } else {
          closeMenu();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [visible, history]);

  if (!visible || !currentMenu) return null;

  return (
    <Overlay>
      <Card>
        <Header>
          <Title>{currentMenu.title}</Title>
          {history.length > 1 && <BackButton onClick={() => setHistory(prev => prev.slice(0, -1))}>Back</BackButton>}
        </Header>

        <List>
          {currentMenu.options?.map((option, index) => {
            const optionKey = `${option.title}-${index}`;
            const isOpen = dropdown?.key === optionKey;

            return (
              <ItemCard key={optionKey}>
                <ItemButton onClick={() => onSelectOption(option, optionKey)}>
                  <ItemTitle>
                    <span>{option.title}</span>
                    {option.menu ? <span>{isOpen ? 'v' : '>'}</span> : null}
                  </ItemTitle>
                  {option.description ? <ItemDescription>{option.description}</ItemDescription> : null}
                </ItemButton>

                {isOpen && dropdown ? (
                  <InlinePanel>
                    {dropdown.type === 'submenu' && (
                      <List>
                        {(dropdown.options || []).map((subOption, subIndex) => {
                          const subKey = `${optionKey}-sub-${subIndex}`;
                          const subIsOpen = nestedDropdown?.key === subKey;
                          return (
                            <ItemCard key={subKey}>
                              <ItemButton onClick={() => onSelectSubOption(subOption, subKey)}>
                                <ItemTitle>
                                  <span>{subOption.title}</span>
                                  {subOption.event === 'illenium-appearance:client:generateOutfitCode' ? (
                                    <span>{subIsOpen ? 'v' : '>'}</span>
                                  ) : null}
                                </ItemTitle>
                                {subOption.description ? <ItemDescription>{subOption.description}</ItemDescription> : null}
                              </ItemButton>

                              {subIsOpen && nestedDropdown ? (
                                <InlinePanel>
                                  {(nestedDropdown.type === 'import' || nestedDropdown.type === 'save') && (
                                    <FormGroup>
                                      <FormLabel>Outfit Name</FormLabel>
                                      <FormInput
                                        value={nestedDropdown.name}
                                        onChange={e =>
                                          setNestedDropdown(prev => (prev ? { ...prev, name: e.target.value } : prev))
                                        }
                                        placeholder={
                                          nestedDropdown.type === 'import' ? 'Imported Outfit' : 'Very cool outfit'
                                        }
                                      />
                                    </FormGroup>
                                  )}

                                  {nestedDropdown.type === 'import' && (
                                    <FormGroup>
                                      <FormLabel>Outfit Code</FormLabel>
                                      <FormInput
                                        value={nestedDropdown.code}
                                        onChange={e =>
                                          setNestedDropdown(prev => (prev ? { ...prev, code: e.target.value } : prev))
                                        }
                                        placeholder="XXXXXXXXXXXX"
                                      />
                                    </FormGroup>
                                  )}

                                  {nestedDropdown.type === 'generate' && (
                                    <FormGroup>
                                      <FormLabel>Generated Outfit Code</FormLabel>
                                      <FormInput
                                        value={nestedDropdown.loading ? 'Generating...' : nestedDropdown.code}
                                        readOnly
                                      />
                                    </FormGroup>
                                  )}

                                  {(nestedDropdown.type === 'store_create' || nestedDropdown.type === 'store_edit') && (
                                    <>
                                      {nestedDropdown.type === 'store_create' && (
                                        <FormGroup>
                                          <FormLabel>Store Type</FormLabel>
                                          <FormSelect
                                            value={nestedDropdown.storeType || 'clothing'}
                                            onChange={e =>
                                              setNestedDropdown(prev =>
                                                prev ? { ...prev, storeType: e.target.value } : prev,
                                              )
                                            }
                                          >
                                            <option value="clothing">Clothing</option>
                                            <option value="barber">Barber</option>
                                            <option value="tattoo">Tattoo</option>
                                            <option value="surgeon">Surgeon</option>
                                          </FormSelect>
                                        </FormGroup>
                                      )}
                                      <FormGroup>
                                        <FormLabel>Rotation</FormLabel>
                                        <FormInput
                                          type="number"
                                          value={nestedDropdown.rotation ?? 0}
                                          onChange={e =>
                                            setNestedDropdown(prev =>
                                              prev ? { ...prev, rotation: Number(e.target.value) } : prev,
                                            )
                                          }
                                        />
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel>Zone Size X</FormLabel>
                                        <FormInput
                                          type="number"
                                          value={nestedDropdown.sizeX ?? 4}
                                          onChange={e =>
                                            setNestedDropdown(prev =>
                                              prev ? { ...prev, sizeX: Number(e.target.value) } : prev,
                                            )
                                          }
                                        />
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel>Zone Size Y</FormLabel>
                                        <FormInput
                                          type="number"
                                          value={nestedDropdown.sizeY ?? 4}
                                          onChange={e =>
                                            setNestedDropdown(prev =>
                                              prev ? { ...prev, sizeY: Number(e.target.value) } : prev,
                                            )
                                          }
                                        />
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel>Zone Size Z</FormLabel>
                                        <FormInput
                                          type="number"
                                          value={nestedDropdown.sizeZ ?? 4}
                                          onChange={e =>
                                            setNestedDropdown(prev =>
                                              prev ? { ...prev, sizeZ: Number(e.target.value) } : prev,
                                            )
                                          }
                                        />
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel>Job Restriction</FormLabel>
                                        <FormInput
                                          value={nestedDropdown.job || ''}
                                          onChange={e =>
                                            setNestedDropdown(prev => (prev ? { ...prev, job: e.target.value } : prev))
                                          }
                                        />
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel>Gang Restriction</FormLabel>
                                        <FormInput
                                          value={nestedDropdown.gang || ''}
                                          onChange={e =>
                                            setNestedDropdown(prev => (prev ? { ...prev, gang: e.target.value } : prev))
                                          }
                                        />
                                      </FormGroup>
                                      <FormGroup>
                                        <FormLabel>
                                          <input
                                            type="checkbox"
                                            checked={nestedDropdown.showBlip !== false}
                                            onChange={e =>
                                              setNestedDropdown(prev =>
                                                prev ? { ...prev, showBlip: e.target.checked } : prev,
                                              )
                                            }
                                          />{' '}
                                          Show Blip
                                        </FormLabel>
                                      </FormGroup>
                                    </>
                                  )}

                                  {nestedDropdown.type === 'store_delete' && (
                                    <FormGroup>
                                      <FormLabel>Delete this store location?</FormLabel>
                                      <ItemDescription>This cannot be undone.</ItemDescription>
                                    </FormGroup>
                                  )}

                                  <FormActions>
                                    <button onClick={() => setNestedDropdown(null)}>Cancel</button>
                                    {nestedDropdown.type === 'generate' ? (
                                      <button
                                        onClick={() => {
                                          if (!nestedDropdown.code) return;
                                          Nui.post('internal_menu_generated_code_action', {
                                            action: 'copy',
                                            code: nestedDropdown.code,
                                          });
                                        }}
                                      >
                                        Copy
                                      </button>
                                    ) : nestedDropdown.type === 'store_create' || nestedDropdown.type === 'store_edit' ? (
                                      <button
                                        onClick={async () => {
                                          const payload = {
                                            id: nestedDropdown.id,
                                            type: nestedDropdown.storeType || 'clothing',
                                            rotation: Number(nestedDropdown.rotation || 0),
                                            size: {
                                              x: Number(nestedDropdown.sizeX || 4),
                                              y: Number(nestedDropdown.sizeY || 4),
                                              z: Number(nestedDropdown.sizeZ || 4),
                                            },
                                            coords: nestedDropdown.coords,
                                            job: nestedDropdown.job || null,
                                            gang: nestedDropdown.gang || null,
                                            showBlip: nestedDropdown.showBlip !== false,
                                          };
                                          await Nui.post(
                                            nestedDropdown.type === 'store_create'
                                              ? 'internal_menu_store_create_submit'
                                              : 'internal_menu_store_update_submit',
                                            payload,
                                          );
                                          setNestedDropdown(null);
                                        }}
                                      >
                                        Submit
                                      </button>
                                    ) : nestedDropdown.type === 'store_delete' ? (
                                      <button
                                        onClick={async () => {
                                          if (!nestedDropdown.id) return;
                                          await Nui.post('internal_menu_store_delete_submit', { id: nestedDropdown.id });
                                          setNestedDropdown(null);
                                        }}
                                      >
                                        Delete
                                      </button>
                                    ) : (
                                      <button
                                        onClick={async () => {
                                          if (nestedDropdown.type === 'import') {
                                            await Nui.post('internal_menu_import_submit', {
                                              outfitName: nestedDropdown.name,
                                              outfitCode: nestedDropdown.code,
                                            });
                                          } else {
                                            await Nui.post('internal_menu_save_submit', {
                                              outfitName: nestedDropdown.name,
                                            });
                                          }
                                          setNestedDropdown(null);
                                        }}
                                      >
                                        Submit
                                      </button>
                                    )}
                                  </FormActions>
                                </InlinePanel>
                              ) : null}
                            </ItemCard>
                          );
                        })}
                      </List>
                    )}

                    {(dropdown.type === 'import' || dropdown.type === 'save') && (
                      <FormGroup>
                        <FormLabel>Outfit Name</FormLabel>
                        <FormInput
                          value={dropdown.name}
                          onChange={e => setDropdown(prev => (prev ? { ...prev, name: e.target.value } : prev))}
                          placeholder={dropdown.type === 'import' ? 'Imported Outfit' : 'Very cool outfit'}
                        />
                      </FormGroup>
                    )}

                    {dropdown.type === 'import' && (
                      <FormGroup>
                        <FormLabel>Outfit Code</FormLabel>
                        <FormInput
                          value={dropdown.code}
                          onChange={e => setDropdown(prev => (prev ? { ...prev, code: e.target.value } : prev))}
                          placeholder="XXXXXXXXXXXX"
                        />
                      </FormGroup>
                    )}

                    {dropdown.type === 'generate' && (
                      <FormGroup>
                        <FormLabel>Generated Outfit Code</FormLabel>
                        <FormInput value={dropdown.loading ? 'Generating...' : dropdown.code} readOnly />
                      </FormGroup>
                    )}

                    {(dropdown.type === 'store_create' || dropdown.type === 'store_edit') && (
                      <>
                        {dropdown.type === 'store_create' && (
                          <FormGroup>
                            <FormLabel>Store Type</FormLabel>
                            <FormSelect
                              value={dropdown.storeType || 'clothing'}
                              onChange={e => setDropdown(prev => (prev ? { ...prev, storeType: e.target.value } : prev))}
                            >
                              <option value="clothing">Clothing</option>
                              <option value="barber">Barber</option>
                              <option value="tattoo">Tattoo</option>
                              <option value="surgeon">Surgeon</option>
                            </FormSelect>
                          </FormGroup>
                        )}
                        <FormGroup>
                          <FormLabel>Rotation</FormLabel>
                          <FormInput
                            type="number"
                            value={dropdown.rotation ?? 0}
                            onChange={e => setDropdown(prev => (prev ? { ...prev, rotation: Number(e.target.value) } : prev))}
                          />
                        </FormGroup>
                        <FormGroup>
                          <FormLabel>Zone Size X</FormLabel>
                          <FormInput
                            type="number"
                            value={dropdown.sizeX ?? 4}
                            onChange={e => setDropdown(prev => (prev ? { ...prev, sizeX: Number(e.target.value) } : prev))}
                          />
                        </FormGroup>
                        <FormGroup>
                          <FormLabel>Zone Size Y</FormLabel>
                          <FormInput
                            type="number"
                            value={dropdown.sizeY ?? 4}
                            onChange={e => setDropdown(prev => (prev ? { ...prev, sizeY: Number(e.target.value) } : prev))}
                          />
                        </FormGroup>
                        <FormGroup>
                          <FormLabel>Zone Size Z</FormLabel>
                          <FormInput
                            type="number"
                            value={dropdown.sizeZ ?? 4}
                            onChange={e => setDropdown(prev => (prev ? { ...prev, sizeZ: Number(e.target.value) } : prev))}
                          />
                        </FormGroup>
                        <FormGroup>
                          <FormLabel>Job Restriction</FormLabel>
                          <FormInput
                            value={dropdown.job || ''}
                            onChange={e => setDropdown(prev => (prev ? { ...prev, job: e.target.value } : prev))}
                          />
                        </FormGroup>
                        <FormGroup>
                          <FormLabel>Gang Restriction</FormLabel>
                          <FormInput
                            value={dropdown.gang || ''}
                            onChange={e => setDropdown(prev => (prev ? { ...prev, gang: e.target.value } : prev))}
                          />
                        </FormGroup>
                        <FormGroup>
                          <FormLabel>
                            <input
                              type="checkbox"
                              checked={dropdown.showBlip !== false}
                              onChange={e => setDropdown(prev => (prev ? { ...prev, showBlip: e.target.checked } : prev))}
                            />{' '}
                            Show Blip
                          </FormLabel>
                        </FormGroup>
                      </>
                    )}

                    {dropdown.type === 'store_delete' && (
                      <FormGroup>
                        <FormLabel>Delete this store location?</FormLabel>
                        <ItemDescription>This cannot be undone.</ItemDescription>
                      </FormGroup>
                    )}

                    <FormActions>
                      <button onClick={() => setDropdown(null)}>Cancel</button>
                      {dropdown.type === 'generate' ? (
                        <button
                          onClick={() => {
                            if (!dropdown.code) return;
                            Nui.post('internal_menu_generated_code_action', { action: 'copy', code: dropdown.code });
                          }}
                        >
                          Copy
                        </button>
                      ) : dropdown.type === 'store_create' || dropdown.type === 'store_edit' ? (
                        <button
                          onClick={async () => {
                            const payload = {
                              id: dropdown.id,
                              type: dropdown.storeType || 'clothing',
                              rotation: Number(dropdown.rotation || 0),
                              size: {
                                x: Number(dropdown.sizeX || 4),
                                y: Number(dropdown.sizeY || 4),
                                z: Number(dropdown.sizeZ || 4),
                              },
                              coords: dropdown.coords,
                              job: dropdown.job || null,
                              gang: dropdown.gang || null,
                              showBlip: dropdown.showBlip !== false,
                            };
                            await Nui.post(
                              dropdown.type === 'store_create'
                                ? 'internal_menu_store_create_submit'
                                : 'internal_menu_store_update_submit',
                              payload,
                            );
                            setDropdown(null);
                          }}
                        >
                          Submit
                        </button>
                      ) : dropdown.type === 'store_delete' ? (
                        <button
                          onClick={async () => {
                            if (!dropdown.id) return;
                            await Nui.post('internal_menu_store_delete_submit', { id: dropdown.id });
                            setDropdown(null);
                          }}
                        >
                          Delete
                        </button>
                      ) : (
                        <button
                          onClick={async () => {
                            if (dropdown.type === 'import') {
                              await Nui.post('internal_menu_import_submit', {
                                outfitName: dropdown.name,
                                outfitCode: dropdown.code,
                              });
                            } else {
                              await Nui.post('internal_menu_save_submit', {
                                outfitName: dropdown.name,
                              });
                            }
                            setDropdown(null);
                          }}
                        >
                          Submit
                        </button>
                      )}
                    </FormActions>
                  </InlinePanel>
                ) : null}
              </ItemCard>
            );
          })}
        </List>

        <Footer>Press ESC to close</Footer>
      </Card>
    </Overlay>
  );
};

export default InternalMenu;
