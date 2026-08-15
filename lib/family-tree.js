/**
 * lib/family-tree.js
 * Construye un árbol jerárquico a partir de miembros (sin parentId: agrupa por generación).
 */
(function (global) {
  const kernel = global.DorLdorKernel || {};

  kernel.FAMILY_GENERATIONS = [
    { id: 'grandparents', name: 'Abuelos', match: /Abuel/i },
    { id: 'parents', name: 'Padres / Tíos', match: /Padre|Madre|Tío|Tia|Tía/i },
    { id: 'children', name: 'Hijos', match: /.*/ }
  ];

  kernel.generationOf = function generationOf(member) {
    const rel = (member && member.relationship) || '';
    if (/Abuel/i.test(rel)) return 'grandparents';
    if (/Padre|Madre|Tío|Tia|Tía/i.test(rel)) return 'parents';
    return 'children';
  };

  kernel.familyRootName = function familyRootName(members) {
    const surnames = (members || [])
      .map((member) => {
        const parts = String(member.name || '')
          .trim()
          .split(/\s+/);
        return parts.length > 1 ? parts[parts.length - 1] : '';
      })
      .filter(Boolean);

    if (!surnames.length) return 'Familia';
    const counts = {};
    surnames.forEach((surname) => {
      counts[surname] = (counts[surname] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    return `Familia ${top}`;
  };

  kernel.toTreeNode = function toTreeNode(member) {
    return {
      id: member.id,
      name: member.name,
      hebrewName: member.hebrewName || '',
      relationship: member.relationship || '',
      children: []
    };
  };

  kernel.buildFamilyTree = function buildFamilyTree(members) {
    const list = Array.isArray(members) ? members.filter((member) => member && member.name) : [];
    const groups = {
      grandparents: [],
      parents: [],
      children: []
    };

    list.forEach((member) => {
      groups[kernel.generationOf(member)].push(kernel.toTreeNode(member));
    });

    const filled = [
      { name: 'Abuelos', nodes: groups.grandparents },
      { name: 'Padres / Tíos', nodes: groups.parents },
      { name: 'Hijos', nodes: groups.children }
    ].filter((group) => group.nodes.length);

    const root = {
      name: kernel.familyRootName(list),
      relationship: 'Familia',
      hebrewName: '',
      children: []
    };

    if (!filled.length) return root;
    if (filled.length === 1) {
      root.children = filled[0].nodes;
      return root;
    }

    root.children = filled.map((group) => ({
      name: group.name,
      relationship: 'Generación',
      hebrewName: '',
      children: group.nodes
    }));
    return root;
  };

  global.DorLdorKernel = kernel;
})(typeof globalThis !== 'undefined' ? globalThis : window);
