// import KDTree from "./KDTree";

// export default class NoteHarmonizer {
//   private _leaf_size: number;
//   private _key_signature_chroma_vectors: Float32Array;
//   private _key_signature_tree: KDTree;
//   private _chord_chroma_vectors: Float32Array | null;
//   private _chord_chroma_tree: KDTree | null;
//   private _chord_collection: any | null;

//   constructor(leaf_size: number = 5) {
//     this._leaf_size = leaf_size;
//     this._key_signature_chroma_vectors = this.__get_key_signature_chroma_vectors();
//     this._key_signature_tree = new KDTree(this._key_signature_chroma_vectors, { leaf_size: this._leaf_size });

//     this._chord_chroma_vectors = null;
//     this._chord_chroma_tree = null;
//     this._chord_collection = null;
//   }
// }
